import { notFound } from 'next/navigation';

import { SubmissionDetailView } from '@/components/submission-detail/SubmissionDetailView';

export default async function SubmissionDetailPage({ params }: PageProps<'/submissions/[id]'>) {
  const { id } = await params;

  // Ids are numeric; anything else can't exist, so don't even ask the API.
  if (!/^\d+$/.test(id)) {
    notFound();
  }

  return <SubmissionDetailView id={id} />;
}
