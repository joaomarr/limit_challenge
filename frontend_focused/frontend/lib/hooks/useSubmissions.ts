'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import {
  PaginatedResponse,
  SubmissionDetail,
  SubmissionListFilters,
  SubmissionListItem,
} from '@/lib/types';

export const PAGE_SIZE_OPTIONS = [10, 20, 50];
export const DEFAULT_PAGE_SIZE = 20;

export const submissionKeys = {
  all: ['submissions'] as const,
  list: (filters: SubmissionListFilters) => [...submissionKeys.all, 'list', filters] as const,
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
