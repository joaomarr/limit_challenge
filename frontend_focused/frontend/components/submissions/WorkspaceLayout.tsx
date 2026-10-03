import { Box, Paper, Stack } from '@mui/material';
import { ReactNode, Ref } from 'react';

interface Props {
  header: ReactNode;
  filters: ReactNode;
  table: ReactNode;
  footer: ReactNode;
  /** Thin progress bar shown over the table while refetching. */
  overlay?: ReactNode;
  tableScrollRef?: Ref<HTMLDivElement>;
}

/**
 * App-shell layout: the page is exactly one viewport tall and only the table
 * scrolls, so the title, filters and pagination stay in place and no state
 * change can push the rest of the page around.
 */
export function WorkspaceLayout({
  header,
  filters,
  table,
  footer,
  overlay,
  tableScrollRef,
}: Props) {
  return (
    <Stack
      spacing={2}
      sx={{
        height: '100dvh',
        minHeight: 560,
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 2.5 },
        maxWidth: 1600,
        mx: 'auto',
      }}
    >
      <Box sx={{ flexShrink: 0 }}>{header}</Box>
      <Box sx={{ flexShrink: 0 }}>{filters}</Box>
      <Paper
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {overlay}
        <Box ref={tableScrollRef} sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          {table}
        </Box>
        <Box sx={{ flexShrink: 0, borderTop: 1, borderColor: 'divider', px: 2, py: 1 }}>
          {footer}
        </Box>
      </Paper>
    </Stack>
  );
}
