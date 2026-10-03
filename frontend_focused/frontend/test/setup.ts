import { cleanup } from '@testing-library/react';
import { createElement } from 'react';
import { afterEach, vi } from 'vitest';

vi.mock('next/navigation', () => import('./navigation'));

// next/link needs the App Router context; a plain anchor is enough for these tests.
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) =>
    createElement('a', { href, ...props }, children),
}));

// jsdom has no layout engine, so it doesn't implement scrolling.
Element.prototype.scrollTo ??= () => {};

afterEach(() => {
  cleanup();
});
