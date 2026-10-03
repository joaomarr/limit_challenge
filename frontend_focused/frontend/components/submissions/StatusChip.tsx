import { Box } from '@mui/material';

import { STATUS_LABELS } from '@/lib/submission-labels';
import { SubmissionStatus } from '@/lib/types';

const STATUS_COLORS: Record<SubmissionStatus, { fg: string; bg: string }> = {
  new: { fg: '#1d4f91', bg: '#e6eefa' },
  in_review: { fg: '#8a5a0b', bg: '#fbf0dc' },
  closed: { fg: '#2f6b3a', bg: '#e5f1e6' },
  lost: { fg: '#6b675f', bg: '#efede8' },
};

export function StatusChip({ status }: { status: SubmissionStatus }) {
  const { fg, bg } = STATUS_COLORS[status];
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 1,
        py: 0.25,
        borderRadius: 1,
        fontSize: '0.75rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        color: fg,
        bgcolor: bg,
      }}
    >
      {STATUS_LABELS[status]}
    </Box>
  );
}
