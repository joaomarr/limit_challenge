import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import { useDebouncedCallback } from '@/lib/hooks/useDebouncedCallback';

const SEARCH_DELAY_MS = 300;

interface Props {
  value: string;
  onSearch: (value: string) => void;
}

export function CompanySearchField({ value, onSearch }: Props) {
  const [input, setInput] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const { run, cancel } = useDebouncedCallback(onSearch, SEARCH_DELAY_MS);

  // The URL changed. Only overwrite what's typed when it really disagrees (e.g.
  // "Clear filters"); our own trimmed search must not eat a trailing space.
  // Adjusted during render rather than in an effect, per the React docs.
  if (value !== prevValue) {
    setPrevValue(value);
    if (value !== input.trim()) {
      setInput(value);
    }
  }

  // Any search still scheduled is stale once the URL changes.
  useEffect(() => cancel, [value, cancel]);

  return (
    <TextField
      size="small"
      label="Company"
      placeholder="Search by name…"
      slotProps={{ inputLabel: { shrink: true } }}
      value={input}
      onChange={(event) => {
        setInput(event.target.value);
        run(event.target.value.trim());
      }}
      sx={{ flex: 1, minWidth: 220 }}
    />
  );
}
