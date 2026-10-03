import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDebouncedCallback } from './useDebouncedCallback';

describe('useDebouncedCallback', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('calls once, with the last arguments, after the calls stop', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 300));

    result.current.run('a');
    vi.advanceTimersByTime(200);
    result.current.run('ab');
    vi.advanceTimersByTime(200);
    result.current.run('abc');

    // 400ms since the first call, but never 300ms of quiet: a delay would have fired.
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('abc');
  });

  it('does nothing after cancel', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 300));

    result.current.run('abc');
    result.current.cancel();
    vi.advanceTimersByTime(1000);

    expect(callback).not.toHaveBeenCalled();
  });

  it('does nothing after unmount', () => {
    const callback = vi.fn();
    const { result, unmount } = renderHook(() => useDebouncedCallback(callback, 300));

    result.current.run('abc');
    unmount();
    vi.advanceTimersByTime(1000);

    expect(callback).not.toHaveBeenCalled();
  });

  it('calls the latest callback while keeping run stable across renders', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHook(({ cb }) => useDebouncedCallback(cb, 300), {
      initialProps: { cb: first },
    });
    const run = result.current.run;

    run('abc');
    rerender({ cb: second });
    act(() => vi.advanceTimersByTime(300));

    expect(result.current.run).toBe(run);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith('abc');
  });
});
