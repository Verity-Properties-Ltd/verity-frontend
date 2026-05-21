import { FullPageShare } from './FullPageShare';

export default async function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FullPageShare vpid={id} />;
}
