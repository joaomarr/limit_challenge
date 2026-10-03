import {
  Link as MuiLink,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { ReactNode } from 'react';

import { monoFontFamily } from '@/app/theme';
import { formatDate, formatRelative } from '@/lib/format';
import { usePrefetchSubmission } from '@/lib/hooks/useSubmissions';
import { SubmissionListItem } from '@/lib/types';

import { PriorityLabel } from './PriorityLabel';
import { StatusChip } from './StatusChip';

// Fixed column widths (table-layout: fixed) so the layout doesn't reflow when a
// new page brings longer or shorter company names.
const COLUMNS = [
  { label: 'Company', width: '22%' },
  { label: 'Status', width: 112 },
  { label: 'Priority', width: 104 },
  { label: 'Broker', width: '16%' },
  { label: 'Owner', width: '13%' },
  { label: 'Latest note', width: undefined },
  { label: 'Received', width: 128, align: 'right' as const },
];

const ROW_HEIGHT = 68;

interface Props {
  submissions: SubmissionListItem[] | undefined;
  isLoading: boolean;
  skeletonRows: number;
  /** Rendered instead of rows (empty or error state), below the header. */
  message?: ReactNode;
}

export function SubmissionsTable({ submissions, isLoading, skeletonRows, message }: Props) {
  return (
    <Table stickyHeader size="small" sx={{ tableLayout: 'fixed', minWidth: 960 }}>
      <TableHead>
        <TableRow>
          {COLUMNS.map((column) => (
            <TableCell key={column.label} align={column.align} sx={{ width: column.width }}>
              {column.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      {/* A different result set is a new list, not the old one reordered: remounting
          the body stops reused rows from "moving" (which counts as layout shift). */}
      <TableBody key={submissions?.map((submission) => submission.id).join(',')}>
        {message ? (
          <TableRow>
            <TableCell colSpan={COLUMNS.length} sx={{ border: 0 }}>
              {message}
            </TableCell>
          </TableRow>
        ) : isLoading || !submissions ? (
          Array.from({ length: skeletonRows }, (_, i) => <SkeletonRow key={i} />)
        ) : (
          submissions.map((submission) => (
            <SubmissionRow key={submission.id} submission={submission} />
          ))
        )}
      </TableBody>
    </Table>
  );
}

const rowSx = {
  height: ROW_HEIGHT,
  '& td': { py: 1.25, verticalAlign: 'top' },
};

function SubmissionRow({ submission }: { submission: SubmissionListItem }) {
  const { company, latestNote } = submission;
  const prefetch = usePrefetchSubmission();
  const prefetchDetail = () => prefetch(String(submission.id));

  return (
    <TableRow
      hover
      sx={{
        ...rowSx,
        // The company link stretches over the whole row (see ::after), so the row is
        // clickable while keeping a real <a> for keyboard, middle-click and new tabs.
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <TableCell>
        <MuiLink
          component={Link}
          href={`/submissions/${submission.id}`}
          // The link covers the whole row, so hovering anywhere signals intent.
          onMouseEnter={prefetchDetail}
          onFocus={prefetchDetail}
          underline="none"
          color="text.primary"
          noWrap
          sx={{
            display: 'block',
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
        <Typography variant="body2" noWrap>
          {submission.broker.name}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" noWrap>
          {submission.owner.fullName}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" noWrap color={latestNote ? 'text.primary' : 'text.secondary'}>
          {latestNote ? latestNote.bodyPreview : 'No notes yet'}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap component="div">
          {latestNote && `${latestNote.authorName}, ${formatRelative(latestNote.createdAt)} · `}
          {pluralize(submission.documentCount, 'doc')} · {pluralize(submission.noteCount, 'note')}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Tooltip title={formatDate(submission.createdAt)} placement="left">
          <Typography
            variant="body2"
            noWrap
            sx={{ fontFamily: monoFontFamily, fontSize: '0.8rem' }}
          >
            {formatRelative(submission.createdAt)}
          </Typography>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

function SkeletonRow() {
  return (
    <TableRow sx={rowSx}>
      <TableCell>
        <Skeleton width="75%" />
        <Skeleton width="50%" height={18} />
      </TableCell>
      <TableCell>
        <Skeleton width={64} height={24} />
      </TableCell>
      <TableCell>
        <Skeleton width={56} />
      </TableCell>
      <TableCell>
        <Skeleton width="80%" />
      </TableCell>
      <TableCell>
        <Skeleton width="70%" />
      </TableCell>
      <TableCell>
        <Skeleton width="90%" />
        <Skeleton width="45%" height={18} />
      </TableCell>
      <TableCell align="right">
        <Skeleton width={56} sx={{ ml: 'auto' }} />
      </TableCell>
    </TableRow>
  );
}

function pluralize(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}
