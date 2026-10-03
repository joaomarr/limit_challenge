'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/lib/hooks/useSubmissions';
import { SubmissionListFilters, SubmissionPriority, SubmissionStatus } from '@/lib/types';

const STATUSES: SubmissionStatus[] = ['new', 'in_review', 'closed', 'lost'];
const PRIORITIES: SubmissionPriority[] = ['high', 'medium', 'low'];

export function parseFilters(params: URLSearchParams): SubmissionListFilters {
  const status = params.get('status');
  const priority = params.get('priority');
  const page = Number(params.get('page'));
  const pageSize = Number(params.get('pageSize'));

  return {
    status: STATUSES.includes(status as SubmissionStatus)
      ? (status as SubmissionStatus)
      : undefined,
    priority: PRIORITIES.includes(priority as SubmissionPriority)
      ? (priority as SubmissionPriority)
      : undefined,
    brokerId: params.get('brokerId') || undefined,
    companySearch: params.get('companySearch') || undefined,
    page: Number.isInteger(page) && page > 0 ? page : 1,
    pageSize: PAGE_SIZE_OPTIONS.includes(pageSize) ? pageSize : DEFAULT_PAGE_SIZE,
  };
}

export function useSubmissionFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const updateFilters = useCallback(
    (changes: Partial<SubmissionListFilters>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(changes)) {
        if (value === undefined || value === '') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }

      if (!('page' in changes)) {
        params.delete('page');
      }

      const query = params.toString();
      window.history.replaceState(null, '', query ? `${pathname}?${query}` : pathname);
    },
    [searchParams, pathname],
  );

  return { filters, updateFilters };
}
