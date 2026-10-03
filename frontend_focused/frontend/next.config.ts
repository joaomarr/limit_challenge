import type { NextConfig } from 'next';

// NEXT_PUBLIC_* values are inlined at build time. Without this one a deployed build
// silently points at http://localhost:8000 and every request fails in the browser,
// so fail the Vercel build instead.
if (process.env.VERCEL && !process.env.NEXT_PUBLIC_API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL must be set for deployed builds.');
}

const nextConfig: NextConfig = {};

export default nextConfig;
