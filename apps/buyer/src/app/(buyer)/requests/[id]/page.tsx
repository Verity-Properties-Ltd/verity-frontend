import { RequestDetailClient } from './RequestDetailClient';

export default async function RequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RequestDetailClient vpid={id} />;
}
