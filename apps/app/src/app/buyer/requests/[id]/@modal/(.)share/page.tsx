import { ShareModal } from './ShareModal';

export default async function InterceptedSharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ShareModal vpid={id} />;
}
