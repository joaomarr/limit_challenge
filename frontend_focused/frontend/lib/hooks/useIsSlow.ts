'use client';

import { useEffect, useState } from 'react';

/** True once `active` has stayed true for longer than `afterMs`. */
export function useIsSlow(active: boolean, afterMs: number) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => setSlow(true), afterMs);
    return () => {
      clearTimeout(timer);
      setSlow(false);
    };
  }, [active, afterMs]);

  return active && slow;
}
