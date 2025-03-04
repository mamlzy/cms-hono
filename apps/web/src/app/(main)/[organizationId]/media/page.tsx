import { redirect } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;

  redirect(`/${organizationId}/media/folder/root`);
}
