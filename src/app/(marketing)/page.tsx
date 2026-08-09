import { HomeView } from "@/components/marketing/home-view";

/**
 * Routes stay thin: metadata and one feature component. All of the copy is
 * locale-switchable at runtime, so everything below this line is a client
 * component.
 */
export default function HomePage() {
  return <HomeView />;
}
