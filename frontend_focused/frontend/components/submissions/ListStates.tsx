import { Button, Stack, Typography } from '@mui/material';

interface MessageProps {
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

function ListMessage({ title, description, action }: MessageProps) {
  return (
    <Stack alignItems="center" spacing={1} sx={{ py: 10, px: 2, textAlign: 'center' }}>
      <Typography variant="h3" component="p">
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
        {description}
      </Typography>
      {action && (
        <Button variant="outlined" onClick={action.onClick} sx={{ mt: 1.5 }}>
          {action.label}
        </Button>
      )}
    </Stack>
  );
}

export function EmptyState({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <ListMessage
      title="No submissions match"
      description="Try a different status or broker, or search for part of the company name."
      action={onClearFilters && { label: 'Clear all filters', onClick: onClearFilters }}
    />
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <ListMessage
      title="Couldn't load submissions"
      description="The server didn't respond as expected. Check that the API is running and try again."
      action={{ label: 'Try again', onClick: onRetry }}
    />
  );
}
