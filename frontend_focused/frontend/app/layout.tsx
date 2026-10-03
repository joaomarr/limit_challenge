import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { JetBrains_Mono, Newsreader, Public_Sans } from 'next/font/google';

import Providers from './providers';
import './globals.css';

const bodyFont = Public_Sans({ variable: '--font-body', subsets: ['latin'] });
const displayFont = Newsreader({ variable: '--font-display', subsets: ['latin'] });
const monoFont = JetBrains_Mono({ variable: '--font-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Submission Tracker',
  description: 'Review and triage broker submissions',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}>
      {/* Extensions (e.g. ColorZilla) inject attributes into <body> before hydration. */}
      <body suppressHydrationWarning>
        <AppRouterCacheProvider>
          <Providers>{children}</Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
