import { redirect } from "next/navigation";

export default async function PropertyRootPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;
  redirect(`/app/${propertyId}/dispatch`);
}
