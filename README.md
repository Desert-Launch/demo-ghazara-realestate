# غزارة العقارية — Ghazara Real Estate (demo)

A frontend-only listings and lead-capture site for a fictional north-Riyadh
brokerage. Everything a visitor or a staff member can do — browsing, filtering,
saving, enquiring, adding and editing units, moving leads across the board —
works for real, in memory, for the length of the browser session.

There is no backend, no database, no auth server, no payments, no email and no
map integration. Every figure, name, phone number and unit is invented.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`,
`npm run typecheck`. Both `lint` and `typecheck` pass clean.

## The two things this demo is for

1. **`/properties`** — a real searchable listings site: filter by sale/rent,
   type, district, price, beds, baths and area; sort; the filters travel in the
   URL so a link can be shared. The drawn district panel beside the results
   lights up the matching pin as you point at a card, and doubles as a filter.
2. **`/admin`** — the dashboard. `/admin/properties` is full CRUD over the
   units, and `/admin/enquiries` is the lead board where every enquiry lands,
   whatever door it came through.

The two are connected: send an enquiry from a unit page and it is in the
board's **New** column immediately, linked back to that unit. Mark a unit sold
in the dashboard and it leaves the public listings on the spot.

## Where the data lives

`src/lib/store/` is the whole "backend": a module-level singleton holding
properties and enquiries, seeded on first import.

- `seed.ts` — ~30 units across Al Narjis, Al Yasmin, Al Malqa, Al Arid, Al
  Qirawan, Hittin, Al Sahafah and Al Rabie, and ~20 enquiries spread over the
  last two weeks with mixed statuses.
- `db.ts` — typed reads and writes. Nothing outside `src/lib/store` and the
  feature `api.ts` files imports it.

**Resetting the demo data:** the sidebar footer in `/admin` has *أعد ضبط بيانات
العرض / Reset demo data*, which re-seeds the store and invalidates every query.
A hard refresh does the same thing — the store is re-created whenever the module
is evaluated fresh. Nothing is written to `localStorage`.

**Money and periods.** Prices are whole Saudi riyals; a sale price is the total
and a rent price is what one period costs. Riyadh quotes residential rent by the
year, so most rentals carry `rentPeriod: "yearly"` and only the short-let
furnished units are monthly — the period is shown next to the price everywhere.

**Which units the public sees.** Available and reserved units stay on
`/properties`, badged accordingly. Sold and rented units leave the listings but
keep working on a direct link, where the page says plainly that the unit has
gone and offers similar ones.

## Arabic, English and direction

Arabic is the primary language, not a translation layer.

- The server renders `<html lang="ar" dir="rtl">`. That is also the store's
  default, so the first paint is already correct and there is nothing to
  hydrate around.
- `src/lib/i18n/store.ts` holds the locale, and `DirectionSync` mirrors it onto
  `<html lang dir>`. Nothing else writes those attributes.
- `src/lib/i18n/ar.ts` is the source of truth for copy; `en.ts` is typed as
  `Dictionary`, so a key that exists in one and not the other fails
  `npm run typecheck`. Components read copy through `useT()`, never as literals.
- Layout uses logical properties throughout (`ms/me`, `ps/pe`, `start/end`).
  Directional icons mirror with the `rtl:`/`ltr:` variants declared in
  `globals.css`. The two panels that depict a *place* — the district map and the
  office diagram — deliberately keep physical positioning, because mirroring a
  map would move Al Arid to the wrong side of Riyadh.
- **Type is switched by `lang`, not by glyph fallback.** `next/font` emits a
  metric-matched local Arial face beside every Latin family, and that face
  carries no `unicode-range` — chain `Manrope, Tajawal` and Arial claims every
  Arabic glyph before Tajawal is ever asked. So `tokens.css` swaps the whole
  family set on `:root[lang="ar"]`: Tajawal + IBM Plex Sans Arabic for Arabic,
  Manrope + Inter + IBM Plex Mono for English.
- **Numerals are Western in both locales.** Saudi listing sites are written with
  Western digits even in Arabic copy, and a price column only lines up if every
  row uses one set.

## Architecture

Three layers, one direction of travel:

```
app/          routes only — a page is metadata plus one feature component
features/     the real code: components, hooks (TanStack), api.ts, schema.ts
lib/store/    the in-memory database
```

A component never touches the store. It calls a feature hook, the hook calls
that feature's `api.ts`, and only `api.ts` reaches the store — so there is
exactly one place where data changes shape, and every read goes through TanStack
Query with a small deliberate latency so loading and skeleton states are real.
`features/` never imports from `app/`, and cross-feature imports go through each
feature's `index.ts` barrel rather than deep paths. Client-only selection state
that the agency does not own — saved units, the active filter set, the fake
signed-in staff member — lives in Zustand instead.

## Things worth knowing

- **One action fails on purpose.** `advanceEnquiryStatus` drops roughly one move
  in ten. The board moves the card optimistically, then rolls it back to the
  column it came from and says what happened. It is the only deliberate failure
  in the app.
- **There are no photographs.** Every unit is drawn: a measured elevation, plan,
  plot and section in petrol ink on limestone paper, generated deterministically
  from the unit's id so a unit always looks like itself. That is the demo's
  signature, and it is also the honest answer to having no photography yet.
- **The WhatsApp buttons** open a `wa.me` draft against a number in the 05x 000
  0xxx block that no operator issues. Nothing is sent.
- **Traffic figures are illustrative** and labelled as such on the chart —
  nobody is measuring a site that does not exist yet.
