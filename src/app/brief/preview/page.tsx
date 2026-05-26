import BriefPreviewClient from '@/components/brief/BriefPreviewClient';

export default async function BriefPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return <BriefPreviewClient projectId={id ?? null} />;
}
