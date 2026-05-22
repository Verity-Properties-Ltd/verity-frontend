import { PublicCertClient } from './PublicCertClient';
import './public.css';

export default async function PublicCertPage({ params }: { params: Promise<{ vpid: string }> }) {
  const { vpid } = await params;
  return <PublicCertClient vpid={vpid} />;
}
