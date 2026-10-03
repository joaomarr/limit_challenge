import { Box, Skeleton } from '@mui/material';

import { DetailBodySkeleton, DetailPageFrame } from '@/components/submission-detail/DetailSkeleton';

// Rendered as soon as a link to a submission is clicked: the router swaps to this
// while it fetches the route's server payload, instead of keeping the old page.
export default function Loading() {
  return (
    <DetailPageFrame>
      <Box sx={{ mb: 3 }}>
        <Skeleton width={150} />
      </Box>
      <DetailBodySkeleton />
    </DetailPageFrame>
  );
}
