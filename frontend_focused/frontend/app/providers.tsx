'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { PropsWithChildren, useState } from 'react';

import { theme } from './theme';

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Submissions change a few times a day, not every second; avoid refetching
        // on every focus/mount while still picking up changes reasonably fast.
        staleTime: 30_000,
        // Retry transient failures (network, 5xx) once; a 4xx will fail the same way again.
        retry: (failureCount, error) => {
          const status = isAxiosError(error) ? error.response?.status : undefined;
          return failureCount < 1 && !(status && status < 500);
        },
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
