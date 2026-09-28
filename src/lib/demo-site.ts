/**
 * What this demo is, in one place. The Desert Launch bar, the share-preview
 * card, the metadata and the structured data all read from here, so they can
 * never disagree about the name, the URL or the language.
 */
export type DemoLang = "en" | "ar";

export const DEMO = {
  /** Short id the landing site uses; also the subdomain and utm_campaign. */
  slug: "realestate",
  name: "ديمو العقارية — Demo Real Estate",
  /** Latin-only name for the share-preview image, whose default font has no Arabic. */
  latinName: "Demo Real Estate",
  url: "https://realestate.demos.desertlaunch.dev",
  /** Language of the bar and the metadata. Typed as the union so the shared
   *  code that handles both languages stays identical in every demo. */
  lang: "ar" as DemoLang,
  /** Interface languages the demo itself offers. */
  languages: ["ar","en"],
  kind: "real estate brokerage",
  city: "Riyadh",
  /** One paragraph for share previews and search snippets. */
  description:
    "عرض تجريبي يعمل لموقع وساطة عقارية مع لوحة تحكم، من Desert Launch: قوائم قابلة للبحث بفلاتر تنتقل مع الرابط، حفظ الوحدات، استفسارات تصل إلى لوحة العملاء، وإدارة كاملة للوحدات. شركة خيالية وبيانات تجريبية. A working demo of a real estate brokerage website with its admin, by Desert Launch; Arabic-first with an English switch.",
  /** Plain statement that the business is invented. */
  fiction:
    "نشاط تجاري خيالي: الأسماء والأسعار والعناوين وأرقام الهواتف مُختلَقة، والبيانات تجريبية تُعاد عند تحديث الصفحة.",
  features: [
      "Searchable listings: sale/rent, type, district, price, beds, baths, area; filters travel in the URL",
      "District panel that highlights the matching pin and doubles as a filter",
      "Saved units",
      "Enquiry capture that lands on a leads board",
      "Full CRUD over units; sold units leave the public listings",
      "Arabic-first with an English switch and full RTL"
  ],
  repo: "https://github.com/Desert-Launch/demo-ghazara-realestate",
  /** What the demo is, in the words its buyer searches with. The share-preview
   *  title and the heading of llms.txt. In the demo's own language. */
  headline: "موقع وساطة عقارية مع البحث في الوحدات وإدارة العملاء المحتملين",
  /** Who the demo is for: the owner of this kind of business, not the
   *  business's customers. Emitted as `audience` in the JSON-LD. */
  audience: "Real estate brokerages, property developers and property managers",
  /** The Desert Launch page that owns this vertical in search and explains
   *  what a real build adds. The bar's brand link and the JSON-LD point here,
   *  so the demo hands its visitors and its context to one indexed page. */
  industry: {
    url: "https://www.desertlaunch.dev/ar/industries/real-estate/",
    name: "المواقع العقارية من Desert Launch",
  },
  /** The bar's call to action, in the demo's language. */
  cta: "تريد مثله لشركتك العقارية؟",
  /** Routes worth opening, listed in llms.txt. */
  pages: [
    { path: "/", label: "home" },
    { path: "/properties", label: "listings with filters" },
    { path: "/properties/[id]", label: "a unit" },
    { path: "/admin", label: "dashboard" },
    { path: "/admin/properties", label: "unit admin" },
    { path: "/admin/enquiries", label: "leads board" },
  ],
} as const;
