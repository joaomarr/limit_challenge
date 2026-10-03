import { Paper, Stack, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

interface Props {
  title: string;
  count?: number;
}

export function DetailSection({ title, count, children }: PropsWithChildren<Props>) {
  return (
    <Paper component="section" aria-label={title} sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h3" component="h2">
          {title}
        </Typography>
        {count !== undefined && (
          <Typography variant="body2" color="text.secondary">
            {count}
          </Typography>
        )}
      </Stack>
      {children}
    </Paper>
  );
}

export function EmptySectionText({ children }: PropsWithChildren) {
  return (
    <Typography variant="body2" color="text.secondary">
      {children}
    </Typography>
  );
}
