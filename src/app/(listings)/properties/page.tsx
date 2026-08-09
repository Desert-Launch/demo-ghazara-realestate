import { Suspense } from "react";

import { PropertyBrowser } from "@/features/search";

/**
 * `FilterUrlSync` reads the query string, so the browser sits behind a Suspense
 * boundary — that is what `useSearchParams` requires in the App Router.
 */
export default function PropertiesPage() {
  return (
    <Suspense>
      <PropertyBrowser />
    </Suspense>
  );
}
