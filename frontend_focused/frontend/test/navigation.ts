// In-memory stand-in for next/navigation, backed by jsdom's real URL.
//
// useSearchParams follows window.history.replaceState like the real router does.
// `setUrlUpdateDelay` lets a test reproduce what Next does in the browser: the URL
// changes immediately but React only re-renders with it later (in a transition).
import { useMemo, useSyncExternalStore } from 'react';
import { vi } from 'vitest';

const listeners = new Set<() => void>();
let urlUpdateDelayMs = 0;

const nativeReplaceState = window.history.replaceState.bind(window.history);
window.history.replaceState = (...args: Parameters<History['replaceState']>) => {
  nativeReplaceState(...args);
  const notify = () => listeners.forEach((listener) => listener());
  if (urlUpdateDelayMs > 0) setTimeout(notify, urlUpdateDelayMs);
  else notify();
};

export function setUrlUpdateDelay(ms: number) {
  urlUpdateDelayMs = ms;
}

export function resetUrl(url = '/submissions') {
  urlUpdateDelayMs = 0;
  window.history.replaceState(null, '', url);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// React reads these snapshots; with a delay they lag behind the real URL.
let renderedSearch = window.location.search;
let renderedPathname = window.location.pathname;
listeners.add(() => {
  renderedSearch = window.location.search;
  renderedPathname = window.location.pathname;
});

export function useSearchParams() {
  const search = useSyncExternalStore(subscribe, () => renderedSearch);
  return useMemo(() => new URLSearchParams(search), [search]);
}

export function usePathname() {
  return useSyncExternalStore(subscribe, () => renderedPathname);
}

export const routerMock = { push: vi.fn(), replace: vi.fn(), prefetch: vi.fn(), back: vi.fn() };

export function useRouter() {
  return routerMock;
}
