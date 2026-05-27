import ProjectWorkspaceClient from '@/components/project/ProjectWorkspaceClient';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectWorkspaceClient projectId={id} />;
}
