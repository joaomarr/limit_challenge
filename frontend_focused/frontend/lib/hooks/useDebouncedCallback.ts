'use client';

import { useCallback, useEffect, useRef } from 'react';

export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs: number,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const callbackRef = useRef(callback);

  // (A) always store most recent version of the callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // (B) cancel what was scheduled
  const cancel = useCallback(() => clearTimeout(timerRef.current), []);

  // (C) schedule: cancel latest and schedule new one
  const run = useCallback(
    (...args: Args) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callbackRef.current(...args), delayMs);
    },
    [delayMs],
  );

  useEffect(() => cancel, [cancel]);

  return { run, cancel };
}
