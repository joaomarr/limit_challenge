import {
  Box,
  Link as MuiLink,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import Link from 'next/link';

import { formatDate, formatRelative } from '@/lib/format';
import { SubmissionListItem } from '@/lib/types';
import { monoFontFamily } from '@/app/theme';

import { PriorityLabel } from './PriorityLabel';
import { StatusChip } from './StatusChip';

interface Props {
  submissions: SubmissionListItem[];
}

export function SubmissionsTable({ submissions }: Props) {
  return (
    <TableContainer>
      <Table size="small" sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow>
            <TableCell>Company</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Broker</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell sx={{ width: '28%' }}>Latest note</TableCell>
            <TableCell align="right">Received</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {submissions.map((submission, index) => (
            <SubmissionRow key={submission.id} submission={submission} index={index} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function SubmissionRow({ submission, index }: { submission: SubmissionListItem; index: number }) {
  const { company, latestNote } = submission;

  return (
    <TableRow
      hover
      sx={{
        // The company link stretches over the whole row (see ::after below), so the
        // row is clickable while keeping a real <a> for keyboard and middle-click.
        position: 'relative',
        animation: 'rise-in 240ms ease-out both',
        animationDelay: `${index * 25}ms`,
        '& td': { py: 1.5, verticalAlign: 'top' },
      }}
    >
      <TableCell>
        <MuiLink
          component={Link}
          href={`/submissions/${submission.id}`}
          underline="hover"
          color="text.primary"
          sx={{
            fontWeight: 600,
            '&::after': { content: '""', position: 'absolute', inset: 0 },
            '&:focus-visible': { outline: 'none' },
            '&:focus-visible::after': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: -2,
            },
          }}
        >
          {company.legalName}
        </MuiLink>
        <Typography variant="body2" color="text.secondary" noWrap>
          {[company.industry, company.headquartersCity].filter(Boolean).join(' · ')}
        </Typography>
      </TableCell>
      <TableCell>
        <StatusChip status={submission.status} />
      </TableCell>
      <TableCell>
        <PriorityLabel priority={submission.priority} />
      </TableCell>
      <TableCell>
        <Typography variant="body2">{submission.broker.name}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{submission.owner.fullName}</Typography>
      </TableCell>
      <TableCell>
        {latestNote ? (
          <Box>
            <Typography
              variant="body2"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {latestNote.bodyPreview}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {latestNote.authorName} · {formatRelative(latestNote.createdAt)}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No notes yet
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 0.5 }}>
          {pluralize(submission.documentCount, 'document')} ·{' '}
          {pluralize(submission.noteCount, 'note')}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Tooltip title={formatDate(submission.createdAt)}>
          <Typography
            variant="body2"
            sx={{ fontFamily: monoFontFamily, fontSize: '0.8rem', whiteSpace: 'nowrap' }}
          >
            {formatRelative(submission.createdAt)}
          </Typography>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

function pluralize(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}
