'use client';

import { LinearProgress, Stack, Typography } from '@mui/material';
import { isAxiosError } from 'axios';
import { useEffect, useRef } from 'react';

import { useBrokerOptions } from '@/lib/hooks/useBrokerOptions';
import { useDebouncedCallback } from '@/lib/hooks/useDebouncedCallback';
import { useSubmissionFilters } from '@/lib/hooks/useSubmissionFilters';
import { useStatusCounts, useSubmissionsList } from '@/lib/hooks/useSubmissions';
import { rememberListHref } from '@/lib/list-return';

import { FilterBar } from './FilterBar';
import { PaginationFooter } from './PaginationFooter';
import { EmptyState, ErrorState, PageNotFoundState } from './ListStates';
import { SubmissionsTable } from './SubmissionsTable';
import { WorkspaceLayout } from './WorkspaceLayout';

const SEARCH_DELAY_MS = 300;

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
  const statusCountsQuery = useStatusCounts(filters);
  const tableScrollRef = useRef<HTMLDivElement>(null);

  const { data, isPending, isError, isFetching, isPlaceholderData, refetch } = submissionsQuery;
  const companySearch = useDebouncedCallback((value: string) => {
    updateFilters({ companySearch: value || undefined });
  }, SEARCH_DELAY_MS);

  // Cancel synchronously in the click handler: a search typed just before clearing
  // must not land afterwards. (Cancelling from an effect depended on when the URL
  // change re-rendered, which raced the timer.)
  const clearFilters = () => {
    companySearch.cancel();
    updateFilters(CLEARED_FILTERS);
  };

  // A new page or filter starts at the top of the table, and becomes the view
  // "Back to submissions" returns to from the detail page.
  useEffect(() => {
    tableScrollRef.current?.scrollTo({ top: 0 });
    rememberListHref(window.location.pathname + window.location.search);
  }, [filters]);

  const { error } = submissionsQuery;
  let message;
  if (isError && isAxiosError(error) && error.response?.status === 404) {
    message = <PageNotFoundState onFirstPage={() => updateFilters({ page: 1 })} />;
  } else if (isError) {
    message = <ErrorState onRetry={() => refetch()} />;
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
          onCompanySearch={companySearch.run}
          brokers={brokersQuery.data}
          brokersLoading={brokersQuery.isPending}
          statusCounts={statusCountsQuery.data}
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
      <Typography variant="overline" color="primary" sx={{ lineHeight: 2 }}>
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
