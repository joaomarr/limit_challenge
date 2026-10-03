'use client';

import { Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { getListHref } from '@/lib/list-return';

export function BackToListLink() {
  const router = useRouter();

  // The <Link> only prefetches its href ("/submissions"); the click goes to the
  // filtered list URL, so prefetch that one too.
  useEffect(() => {
    router.prefetch(getListHref());
  }, [router]);

  return (
    <MuiLink
      component={Link}
      href="/submissions"
      underline="hover"
      color="text.secondary"
      onClick={(event) => {
        // Modified clicks (new tab/window) keep the plain href.
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        // Read at click time (not during render) so it's the latest list view.
        event.preventDefault();
        router.push(getListHref());
      }}
      sx={{ fontSize: '0.875rem', fontWeight: 600 }}
    >
      ← Back to submissions
    </MuiLink>
  );
}
