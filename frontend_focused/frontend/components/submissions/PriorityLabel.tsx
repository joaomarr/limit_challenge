import { Box } from '@mui/material';

import { PRIORITY_LABELS } from '@/lib/submission-labels';
import { SubmissionPriority } from '@/lib/types';

// Bars read faster than color alone when scanning a long list, and they still
// work for color-blind users.
const PRIORITY_LEVEL: Record<SubmissionPriority, number> = { low: 1, medium: 2, high: 3 };

export function PriorityLabel({ priority }: { priority: SubmissionPriority }) {
  const level = PRIORITY_LEVEL[priority];
  const isHigh = priority === 'high';

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        fontSize: '0.8rem',
        fontWeight: isHigh ? 700 : 500,
        color: isHigh ? 'error.main' : 'text.secondary',
      }}
    >
      <Box
        component="span"
        aria-hidden
        sx={{ display: 'inline-flex', alignItems: 'flex-end', gap: '2px' }}
      >
        {[1, 2, 3].map((bar) => (
          <Box
            key={bar}
            component="span"
            sx={{
              width: 3,
              height: 4 + bar * 3,
              borderRadius: 0.5,
              bgcolor: bar <= level ? 'currentColor' : 'divider',
            }}
          />
        ))}
      </Box>
      {PRIORITY_LABELS[priority]}
    </Box>
  );
}
