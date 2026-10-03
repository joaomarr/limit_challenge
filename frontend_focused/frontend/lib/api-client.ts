import axios from 'axios';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  // The free-tier demo API sleeps when idle and takes up to a minute to wake up.
  timeout: 60_000,
});
