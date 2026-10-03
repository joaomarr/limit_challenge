import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { resetUrl } from '@/test/navigation';

import { parseFilters, useSubmissionFilters } from './useSubmissionFilters';

describe('parseFilters', () => {
  it('reads valid filters from the URL', () => {
    const filters = parseFilters(
      new URLSearchParams(
        'status=in_review&priority=high&brokerId=3&companySearch=acme&page=2&pageSize=50',
      ),
    );

    expect(filters).toEqual({
      status: 'in_review',
      priority: 'high',
      brokerId: '3',
      companySearch: 'acme',
      page: 2,
      pageSize: 50,
    });
  });

  it('falls back to defaults for missing or invalid values', () => {
    const filters = parseFilters(
      new URLSearchParams('status=banana&priority=urgent&page=-3&pageSize=7&companySearch='),
    );

    expect(filters).toEqual({
      status: undefined,
      priority: undefined,
      brokerId: undefined,
      companySearch: undefined,
      page: 1,
      pageSize: 20,
    });
  });
});

describe('useSubmissionFilters', () => {
  beforeEach(() => resetUrl());

  function update(
    changes: Parameters<ReturnType<typeof useSubmissionFilters>['updateFilters']>[0],
  ) {
    const { result } = renderHook(() => useSubmissionFilters());
    act(() => result.current.updateFilters(changes));
    return result;
  }

  it('writes changes to the URL and keeps the other filters', () => {
    resetUrl('/submissions?priority=high');

    const result = update({ status: 'new' });

    expect(window.location.search).toBe('?priority=high&status=new');
    expect(result.current.filters).toMatchObject({ status: 'new', priority: 'high' });
  });

  it('goes back to the first page when a filter changes', () => {
    resetUrl('/submissions?page=3');

    update({ status: 'new' });

    expect(window.location.search).toBe('?status=new');
  });

  it('keeps the page when only the page changes', () => {
    update({ page: 2 });

    expect(window.location.search).toBe('?page=2');
  });

  it('leaves empty values and defaults out of the URL', () => {
    resetUrl('/submissions?companySearch=acme&page=2&pageSize=50');

    update({ companySearch: '', page: 1, pageSize: 20 });

    expect(window.location.search).toBe('');
  });
});
