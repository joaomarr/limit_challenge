import { Box, Link, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

import { PriorityLabel } from '@/components/submissions/PriorityLabel';
import { StatusChip } from '@/components/submissions/StatusChip';
import { formatDate, formatRelative } from '@/lib/format';
import { SubmissionCore } from '@/lib/types';

export function DetailHeader({ submission }: { submission: SubmissionCore }) {
  const { company, broker, owner } = submission;

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="overline" color="text.secondary">
          Submission #{submission.id}
        </Typography>
        <Typography variant="h1">{company.legalName}</Typography>
        <Typography color="text.secondary">
          {[company.industry, company.headquartersCity].filter(Boolean).join(' · ')}
        </Typography>
      </Box>

      <Stack direction="row" spacing={2} alignItems="center">
        <StatusChip status={submission.status} />
        <PriorityLabel priority={submission.priority} />
      </Stack>

      {submission.summary && (
        <Typography sx={{ maxWidth: 720, lineHeight: 1.7 }}>{submission.summary}</Typography>
      )}

      <Box
        component="dl"
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, minmax(0, 1fr))' },
          gap: 2,
          m: 0,
          pt: 2,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Fact label="Broker">
          {broker.name}
          {broker.primaryContactEmail && <EmailLink email={broker.primaryContactEmail} />}
        </Fact>
        <Fact label="Owner">
          {owner.fullName}
          <EmailLink email={owner.email} />
        </Fact>
        <Fact label="Received">
          {formatDate(submission.createdAt)}
          <Secondary>{formatRelative(submission.createdAt)}</Secondary>
        </Fact>
        <Fact label="Last updated">
          {formatDate(submission.updatedAt)}
          <Secondary>{formatRelative(submission.updatedAt)}</Secondary>
        </Fact>
      </Box>
    </Stack>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography component="dt" variant="overline" color="text.secondary" sx={{ lineHeight: 1.8 }}>
        {label}
      </Typography>
      <Box component="dd" sx={{ m: 0, display: 'flex', flexDirection: 'column', fontWeight: 600 }}>
        {children}
      </Box>
    </Box>
  );
}

function Secondary({ children }: { children: ReactNode }) {
  return (
    <Typography component="span" variant="body2" color="text.secondary">
      {children}
    </Typography>
  );
}

function EmailLink({ email }: { email: string }) {
  return (
    <Link
      href={`mailto:${email}`}
      variant="body2"
      underline="hover"
      noWrap
      sx={{ fontWeight: 400 }}
    >
      {email}
    </Link>
  );
}
