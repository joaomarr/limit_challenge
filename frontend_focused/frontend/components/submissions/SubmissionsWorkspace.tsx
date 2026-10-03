'use client';

import { LinearProgress, Stack, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';

import { useBrokerOptions } from '@/lib/hooks/useBrokerOptions';
import { useSubmissionFilters } from '@/lib/hooks/useSubmissionFilters';
import { useSubmissionsList } from '@/lib/hooks/useSubmissions';

import { FilterBar } from './FilterBar';
import { PaginationFooter } from './PaginationFooter';
import { EmptyState, ErrorState } from './ListStates';
import { SubmissionsTable } from './SubmissionsTable';
import { WorkspaceLayout } from './WorkspaceLayout';

const CLEARED_FILTERS = {
  status: undefined,
  priority: undefined,
  brokerId: undefined,
  companySearch: undefined,
};

export function SubmissionsWorkspace() {
  const { filters, updateFilters } = useSubmissionFilters();
  const submissionsQuery = useSubmissionsList(filters);
  const brokersQuery = useBrokerOptions();
  const tableScrollRef = useRef<HTMLDivElement>(null);

  const { data, isPending, isError, isFetching, isPlaceholderData, refetch } = submissionsQuery;
  const clearFilters = () => updateFilters(CLEARED_FILTERS);

  // A new page or filter should start at the top of the table, not where the
  // previous result set was scrolled to.
  useEffect(() => {
    tableScrollRef.current?.scrollTo({ top: 0 });
  }, [filters]);

  let message;
  if (isError) {
    message = (
      <ErrorState onRetry={() => (filters.page > 1 ? updateFilters({ page: 1 }) : refetch())} />
    );
  } else if (data && data.results.length === 0) {
    message = <EmptyState onClearFilters={clearFilters} />;
  }

  return (
    <WorkspaceLayout
      tableScrollRef={tableScrollRef}
      header={<Header count={data?.count} />}
      filters={
        <FilterBar
          filters={filters}
          onChange={updateFilters}
          onClear={clearFilters}
          brokers={brokersQuery.data}
          brokersLoading={brokersQuery.isPending}
        />
      }
      overlay={
        // Background refetch: keep the previous rows (dimmed) and show a thin bar
        // instead of swapping back to skeletons.
        isFetching &&
        !isPending && (
          <LinearProgress
            sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 3 }}
          />
        )
      }
      table={
        <Stack sx={{ opacity: isPlaceholderData ? 0.55 : 1, transition: 'opacity 150ms' }}>
          <SubmissionsTable
            submissions={data?.results}
            isLoading={isPending}
            skeletonRows={filters.pageSize}
            message={message}
          />
        </Stack>
      }
      footer={
        <PaginationFooter
          page={filters.page}
          pageSize={filters.pageSize}
          total={data?.count}
          onPageChange={(page) => updateFilters({ page })}
          onPageSizeChange={(pageSize) => updateFilters({ pageSize })}
        />
      }
    />
  );
}

function Header({ count }: { count: number | undefined }) {
  return (
    <>
      <Typography variant="overline" color="primary">
        Operations
      </Typography>
      <Stack direction="row" alignItems="baseline" spacing={2}>
        <Typography variant="h1">Submissions</Typography>
        <Typography color="text.secondary" aria-live="polite">
          {count === undefined ? ' ' : `${count} ${count === 1 ? 'result' : 'results'}`}
        </Typography>
      </Stack>
    </>
  );
}
