'use client';

import { Box, Stack } from '@mui/material';
import { useParams } from 'next/navigation';

import { BackToListLink } from '@/components/submission-detail/BackToListLink';
import { DetailHeader } from '@/components/submission-detail/DetailHeader';
import {
  DetailGrid,
  DetailPageFrame,
  HeaderSkeleton,
  SectionSkeleton,
} from '@/components/submission-detail/DetailSkeleton';
import { useCachedSubmission } from '@/lib/hooks/useSubmissions';

// Shown the moment a submission link is clicked, while the route's server payload
// loads. A Client Component on purpose: it reads the id from the URL and the list's
// React Query cache (which only exists in the browser), so the real header shows
// instantly when coming from the list. Same layout as the page, so nothing shifts.
export default function Loading() {
  const { id } = useParams<{ id: string }>();
  const cached = useCachedSubmission(id);

  return (
    <DetailPageFrame>
      <Box sx={{ mb: 3 }}>
        <BackToListLink />
      </Box>
      <Stack spacing={4}>
        {cached ? <DetailHeader submission={cached} /> : <HeaderSkeleton />}
        <DetailGrid
          main={<SectionSkeleton lines={6} />}
          aside={
            <>
              <SectionSkeleton lines={3} />
              <SectionSkeleton lines={3} />
            </>
          }
        />
      </Stack>
    </DetailPageFrame>
  );
}
