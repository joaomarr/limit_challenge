import { TextField } from '@mui/material';
import { useState } from 'react';

interface Props {
  value: string;
  /** Called on every keystroke with the trimmed text; the caller debounces it. */
  onSearch: (value: string) => void;
}

export function CompanySearchField({ value, onSearch }: Props) {
  const [input, setInput] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  // The URL changed. Only overwrite what's typed when it really disagrees (e.g.
  // "Clear filters"); our own trimmed search must not eat a trailing space.
  // Adjusted during render rather than in an effect, per the React docs.
  if (value !== prevValue) {
    setPrevValue(value);
    if (value !== input.trim()) {
      setInput(value);
    }
  }

  return (
    <TextField
      size="small"
      label="Company"
      placeholder="Search by name…"
      slotProps={{ inputLabel: { shrink: true } }}
      value={input}
      onChange={(event) => {
        setInput(event.target.value);
        onSearch(event.target.value.trim());
      }}
      sx={{ flex: 1, minWidth: 220 }}
    />
  );
}
