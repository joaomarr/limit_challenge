import { Container } from '@mui/material';
import { Suspense } from 'react';

import { TableSkeleton } from '@/components/submissions/ListStates';
import { SubmissionsWorkspace } from '@/components/submissions/SubmissionsWorkspace';

export default function SubmissionsPage() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      {/* useSearchParams needs a Suspense boundary, otherwise `next build` fails
          when prerendering this route. */}
      <Suspense fallback={<TableSkeleton />}>
        <SubmissionsWorkspace />
      </Suspense>
    </Container>
  );
}
