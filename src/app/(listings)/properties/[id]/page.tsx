import { PropertyDetail } from "@/features/properties";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PropertyDetail id={id} />;
}
