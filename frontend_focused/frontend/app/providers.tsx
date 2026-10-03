'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useState } from 'react';

import { theme } from './theme';

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Submissions change a few times a day, not every second; avoid refetching
        // on every focus/mount while still picking up changes reasonably fast.
        staleTime: 30_000,
        retry: 1,
      },
    },
  });
}

export default function Providers({ children }: PropsWithChildren) {
  // useState (not a module-level constant) so each server request gets its own client.
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
