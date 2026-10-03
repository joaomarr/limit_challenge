import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { AxiosError, AxiosResponse } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '@/lib/api-client';
import { resetUrl, setUrlUpdateDelay } from '@/test/navigation';

import { SubmissionsWorkspace } from './SubmissionsWorkspace';

// Only the network edge is faked: hooks, React Query and the URL logic are real.
vi.mock('@/lib/api-client', () => ({ apiClient: { get: vi.fn() } }));
const get = vi.mocked(apiClient.get);

type Params = Record<string, unknown>;

function mockApi({
  submissions = () => ({ count: 0, results: [] }),
}: { submissions?: (params: Params) => unknown } = {}) {
  get.mockImplementation(async (url: string, config?: { params?: Params }) => {
    if (url === '/brokers/') return { data: [] };
    if (url === '/submissions/status-counts/') return { data: statusCounts(config?.params ?? {}) };
    return { data: submissions(config?.params ?? {}) };
  });
}

function statusCounts(params: Params) {
  const isHigh = params.priority === 'high';
  return [
    { status: 'new', count: isHigh ? 3 : 9 },
    { status: 'in_review', count: isHigh ? 2 : 6 },
    { status: 'closed', count: 4 },
    { status: 'lost', count: 0 },
  ];
}

function submissionRequests() {
  return get.mock.calls
    .filter(([url]) => url === '/submissions/')
    .map(([, config]) => (config as { params: Params }).params);
}

function renderWorkspace() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={queryClient}>
      <SubmissionsWorkspace />
    </QueryClientProvider>,
  );
}

// fireEvent is synchronous, so time only moves when a test calls advance(). One change
// event per character, like a person typing faster than the debounce delay.
function typeInto(input: HTMLInputElement, text: string) {
  for (const char of text) {
    fireEvent.change(input, { target: { value: input.value + char } });
  }
}

const click = (name: string) => fireEvent.click(screen.getByRole('button', { name }));

const advance = (ms: number) => act(() => vi.advanceTimersByTimeAsync(ms));
const searchInput = () => screen.getByPlaceholderText('Search by name…') as HTMLInputElement;

describe('SubmissionsWorkspace', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetUrl();
    get.mockReset();
    mockApi();
  });
  afterEach(() => vi.useRealTimers());

  it('loads the filters from the URL and sends them to the API', async () => {
    resetUrl('/submissions?status=new&companySearch=acme&pageSize=50');

    renderWorkspace();
    await advance(0);

    expect(submissionRequests()).toEqual([
      expect.objectContaining({ status: 'new', companySearch: 'acme', page: 1, pageSize: 50 }),
    ]);
    expect(screen.getByRole('tab', { selected: true }).textContent).toMatch(/^New/);
    expect(searchInput().value).toBe('acme');
  });

  it('searches once, after the user stops typing', async () => {
    renderWorkspace();
    await advance(0);

    typeInto(searchInput(), 'acme');
    expect(submissionRequests().map((p) => p.companySearch)).toEqual([undefined]);

    await advance(300);

    expect(window.location.search).toBe('?companySearch=acme');
    expect(submissionRequests().map((p) => p.companySearch)).toEqual([undefined, 'acme']);
  });

  it('keeps a trailing space typed before a pause', async () => {
    renderWorkspace();

    typeInto(searchInput(), 'acme ');
    await advance(300);

    // The URL holds the trimmed search, but the input must not lose the space.
    expect(window.location.search).toBe('?companySearch=acme');
    expect(searchInput().value).toBe('acme ');
  });

  it('clearing filters cancels a search still waiting to run', async () => {
    resetUrl('/submissions?companySearch=acme');
    renderWorkspace();
    await advance(0);
    // Like Next in the browser: the URL changes now, React sees it a bit later.
    setUrlUpdateDelay(400);

    typeInto(searchInput(), ' corp');
    await advance(100);
    click('Clear filters');
    await advance(1000);

    expect(window.location.search).toBe('');
    expect(searchInput().value).toBe('');
  });

  it('offers the first page when the URL points past the last one', async () => {
    resetUrl('/submissions?page=9');
    get.mockImplementation(async (url: string, config?: { params?: Params }) => {
      if (url === '/brokers/') return { data: [] };
      if (url === '/submissions/status-counts/') return { data: statusCounts({}) };
      if (config?.params?.page === 9) {
        throw new AxiosError('Invalid page', '404', undefined, undefined, {
          status: 404,
        } as AxiosResponse);
      }
      return { data: { count: 0, results: [] } };
    });
    renderWorkspace();
    await advance(0);

    click('Go to first page');

    expect(window.location.search).toBe('');
  });

  it('shows per-status counts that follow the other filters, not the status', async () => {
    resetUrl('/submissions?status=lost&priority=high&page=2');
    renderWorkspace();
    await advance(0);

    expect(screen.getByRole('tab', { name: 'New 3' })).toBeDefined();
    expect(screen.getByRole('tab', { name: 'All 9' })).toBeDefined();
    const countRequests = get.mock.calls.filter(([url]) => url === '/submissions/status-counts/');
    expect(countRequests.map(([, config]) => config?.params)).toEqual([
      { priority: 'high', brokerId: undefined, companySearch: undefined },
    ]);
  });

  it('shows the empty state with a way out', async () => {
    resetUrl('/submissions?status=lost');
    renderWorkspace();
    await advance(0);

    click('Clear all filters');

    expect(window.location.search).toBe('');
  });
});
