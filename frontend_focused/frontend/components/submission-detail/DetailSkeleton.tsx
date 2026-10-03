import { Box, Paper, Skeleton, Stack } from '@mui/material';

export function HeaderSkeleton() {
  return (
    <Stack spacing={1.5} aria-busy aria-label="Loading submission">
      <Skeleton width={120} />
      <Skeleton width="45%" height={48} />
      <Skeleton width="30%" />
      <Skeleton width="70%" height={64} />
    </Stack>
  );
}

export function SectionSkeleton({ lines }: { lines: number }) {
  return (
    <Paper sx={{ p: 2.5 }}>
      <Skeleton width={120} height={32} sx={{ mb: 1 }} />
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} width={`${90 - (i % 3) * 15}%`} />
      ))}
    </Paper>
  );
}

/** Same grid as the loaded page, so swapping in the real content doesn't shift. */
export function DetailBodySkeleton() {
  return (
    <Stack spacing={4}>
      <HeaderSkeleton />
      <DetailGrid main={<SectionSkeleton lines={6} />} aside={<SectionSkeleton lines={3} />} />
    </Stack>
  );
}

export function DetailGrid({ main, aside }: { main: React.ReactNode; aside: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 360px' },
        gap: 3,
        alignItems: 'start',
      }}
    >
      {main}
      <Stack spacing={3}>{aside}</Stack>
    </Box>
  );
}

export function DetailPageFrame({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 2, md: 3 } }}>
      {children}
    </Box>
  );
}
