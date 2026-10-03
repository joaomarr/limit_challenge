'use client';

import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { apiClient } from '@/lib/api-client';
import {
  PaginatedResponse,
  SubmissionCore,
  SubmissionDetail,
  SubmissionListFilters,
  SubmissionListItem,
} from '@/lib/types';

export const PAGE_SIZE_OPTIONS = [10, 20, 50];
export const DEFAULT_PAGE_SIZE = 20;

export const submissionKeys = {
  all: ['submissions'] as const,
  lists: () => [...submissionKeys.all, 'list'] as const,
  list: (filters: SubmissionListFilters) => [...submissionKeys.lists(), filters] as const,
  detail: (id: string) => [...submissionKeys.all, 'detail', id] as const,
};

async function fetchSubmissions(filters: SubmissionListFilters) {
  const response = await apiClient.get<PaginatedResponse<SubmissionListItem>>('/submissions/', {
    params: {
      status: filters.status,
      brokerId: filters.brokerId,
      companySearch: filters.companySearch,
      priority: filters.priority,
      page: filters.page,
      pageSize: filters.pageSize,
    },
  });
  return response.data;
}

async function fetchSubmissionDetail(id: string) {
  if (!id) {
    throw new Error('Submission id is required');
  }

  const response = await apiClient.get<SubmissionDetail>(`/submissions/${id}/`);
  return response.data;
}

export function useSubmissionsList(filters: SubmissionListFilters) {
  return useQuery({
    queryKey: submissionKeys.list(filters),
    queryFn: () => fetchSubmissions(filters),
    placeholderData: keepPreviousData,
  });
}

export function useSubmissionDetail(id: string) {
  return useQuery({
    queryKey: submissionKeys.detail(id),
    queryFn: () => fetchSubmissionDetail(id),
    enabled: Boolean(id),
  });
}

/**
 * The list already fetched the core fields of a submission (company, status,
 * owner...). Reading them from the cache lets the detail page render its header
 * immediately while contacts, documents and notes are still loading.
 */
export function useCachedSubmission(id: string): SubmissionCore | undefined {
  const queryClient = useQueryClient();
  return useMemo(() => {
    const lists = queryClient.getQueriesData<PaginatedResponse<SubmissionListItem>>({
      queryKey: submissionKeys.lists(),
    });
    for (const [, page] of lists) {
      const match = page?.results.find((submission) => String(submission.id) === id);
      if (match) return match;
    }
    return undefined;
  }, [queryClient, id]);
}

/** Start loading a submission's detail before the user clicks (hover/focus intent). */
export function usePrefetchSubmission() {
  const queryClient = useQueryClient();
  return useCallback(
    (id: string) =>
      queryClient.prefetchQuery({
        queryKey: submissionKeys.detail(id),
        queryFn: () => fetchSubmissionDetail(id),
      }),
    [queryClient],
  );
}
