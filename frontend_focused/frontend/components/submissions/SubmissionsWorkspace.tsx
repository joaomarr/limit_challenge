'use client';

import { Box, LinearProgress, Pagination, Paper, Stack, Typography } from '@mui/material';

import { useBrokerOptions } from '@/lib/hooks/useBrokerOptions';
import { useSubmissionFilters } from '@/lib/hooks/useSubmissionFilters';
import { SUBMISSIONS_PAGE_SIZE, useSubmissionsList } from '@/lib/hooks/useSubmissions';

import { FilterBar } from './FilterBar';
import { EmptyState, ErrorState, TableSkeleton } from './ListStates';
import { SubmissionsTable } from './SubmissionsTable';

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

  const { data, isPending, isError, isFetching, isPlaceholderData, refetch } = submissionsQuery;
  const pageCount = data ? Math.max(1, Math.ceil(data.count / SUBMISSIONS_PAGE_SIZE)) : 1;
  const clearFilters = () => updateFilters(CLEARED_FILTERS);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="overline" color="primary">
          Operations
        </Typography>
        <Stack direction="row" alignItems="baseline" spacing={2}>
          <Typography variant="h1">Submissions</Typography>
          {data && (
            <Typography color="text.secondary" aria-live="polite">
              {data.count} {data.count === 1 ? 'result' : 'results'}
            </Typography>
          )}
        </Stack>
      </Box>

      <FilterBar
        filters={filters}
        onChange={updateFilters}
        onClear={clearFilters}
        brokers={brokersQuery.data}
        brokersLoading={brokersQuery.isPending}
      />

      <Paper sx={{ position: 'relative', overflow: 'hidden' }}>
        {/* Background refetch (e.g. a filter change): keep the previous rows visible
            and show a thin bar instead of flashing a skeleton. */}
        {isFetching && !isPending && (
          <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2 }} />
        )}

        {isPending ? (
          <TableSkeleton />
        ) : isError ? (
          <ErrorState onRetry={() => (filters.page > 1 ? updateFilters({ page: 1 }) : refetch())} />
        ) : data.results.length === 0 ? (
          <EmptyState onClearFilters={clearFilters} />
        ) : (
          <Box sx={{ opacity: isPlaceholderData ? 0.6 : 1, transition: 'opacity 150ms' }}>
            <SubmissionsTable submissions={data.results} />
          </Box>
        )}
      </Paper>

      {data && pageCount > 1 && (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Page {filters.page} of {pageCount}
          </Typography>
          <Pagination
            page={filters.page}
            count={pageCount}
            onChange={(_, page) => updateFilters({ page })}
            shape="rounded"
          />
        </Stack>
      )}
    </Stack>
  );
}
