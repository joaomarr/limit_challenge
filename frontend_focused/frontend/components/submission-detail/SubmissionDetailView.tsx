'use client';

import { Box, Button, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { isAxiosError } from 'axios';

import { useCachedSubmission, useSubmissionDetail } from '@/lib/hooks/useSubmissions';

import { BackToListLink } from './BackToListLink';
import { ContactsSection } from './ContactsSection';
import { DetailHeader } from './DetailHeader';
import { DocumentsSection } from './DocumentsSection';
import { NotesTimeline } from './NotesTimeline';

export function SubmissionDetailView({ id }: { id: string }) {
  const detailQuery = useSubmissionDetail(id);
  // Header fields from the list cache, so arriving from the list shows them instantly.
  const cached = useCachedSubmission(id);
  const detail = detailQuery.data;
  const core = detail ?? cached;

  let body;
  if (detailQuery.isError) {
    const notFound = isAxiosError(detailQuery.error) && detailQuery.error.response?.status === 404;
    body = notFound ? (
      <Message
        title="Submission not found"
        description={`There is no submission #${id}. It may have been removed, or the link is wrong.`}
      />
    ) : (
      <Message
        title="Couldn't load this submission"
        description="The server didn't respond as expected. Check that the API is running and try again."
        action={{ label: 'Try again', onClick: () => detailQuery.refetch() }}
      />
    );
  } else {
    body = (
      <Stack spacing={4}>
        {core ? <DetailHeader submission={core} /> : <HeaderSkeleton />}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 360px' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          {detail ? <NotesTimeline notes={detail.notes} /> : <SectionSkeleton lines={6} />}
          <Stack spacing={3}>
            {detail ? (
              <ContactsSection contacts={detail.contacts} />
            ) : (
              <SectionSkeleton lines={3} />
            )}
            {detail ? (
              <DocumentsSection documents={detail.documents} />
            ) : (
              <SectionSkeleton lines={3} />
            )}
          </Stack>
        </Box>
      </Stack>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <BackToListLink />
      </Box>
      {body}
    </Box>
  );
}

function HeaderSkeleton() {
  return (
    <Stack spacing={1.5} aria-busy aria-label="Loading submission">
      <Skeleton width={120} />
      <Skeleton width="45%" height={48} />
      <Skeleton width="30%" />
      <Skeleton width="70%" height={64} />
    </Stack>
  );
}

function SectionSkeleton({ lines }: { lines: number }) {
  return (
    <Paper sx={{ p: 2.5 }}>
      <Skeleton width={120} height={32} sx={{ mb: 1 }} />
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} width={`${90 - (i % 3) * 15}%`} />
      ))}
    </Paper>
  );
}

interface MessageProps {
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

function Message({ title, description, action }: MessageProps) {
  return (
    <Paper sx={{ py: 10, px: 2, textAlign: 'center' }}>
      <Typography variant="h3" component="h1">
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mx: 'auto', maxWidth: 440 }}>
        {description}
      </Typography>
      {action && (
        <Button variant="outlined" onClick={action.onClick} sx={{ mt: 2 }}>
          {action.label}
        </Button>
      )}
    </Paper>
  );
}
