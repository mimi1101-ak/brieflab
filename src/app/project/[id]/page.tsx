import WorkspaceClient from '@/components/workspace/WorkspaceClient';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WorkspaceClient projectId={id} />;
}
