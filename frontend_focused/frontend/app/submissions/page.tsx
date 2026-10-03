import { Suspense } from 'react';

import { SubmissionsTable } from '@/components/submissions/SubmissionsTable';
import { SubmissionsWorkspace } from '@/components/submissions/SubmissionsWorkspace';
import { WorkspaceLayout } from '@/components/submissions/WorkspaceLayout';
import { DEFAULT_PAGE_SIZE } from '@/lib/hooks/useSubmissions';

export default function SubmissionsPage() {
  // useSearchParams needs a Suspense boundary, otherwise `next build` fails when
  // prerendering this route. The fallback reuses the same shell so nothing jumps
  // when the real workspace hydrates.
  return (
    <Suspense
      fallback={
        <WorkspaceLayout
          header={null}
          filters={null}
          table={
            <SubmissionsTable submissions={undefined} isLoading skeletonRows={DEFAULT_PAGE_SIZE} />
          }
          footer={null}
        />
      }
    >
      <SubmissionsWorkspace />
    </Suspense>
  );
}
