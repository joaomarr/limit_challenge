const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const relativeFormatter = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });

const DAY_MS = 24 * 60 * 60 * 1000;

export function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso));
}

export function formatRelative(iso: string, now = Date.now()) {
  const days = Math.round((new Date(iso).getTime() - now) / DAY_MS);
  if (Math.abs(days) < 1) return 'today';
  if (Math.abs(days) < 30) return relativeFormatter.format(days, 'day');
  return formatDate(iso);
}
