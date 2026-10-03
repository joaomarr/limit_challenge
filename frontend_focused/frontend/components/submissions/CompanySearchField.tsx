import { TextField } from '@mui/material';

interface Props {
  value: string;
  onSearch: (value: string) => void;
}

// TODO(F2): keep a local input value and only call onSearch after the user
// pauses typing (useDebouncedValue). For now every keystroke hits the URL.
export function CompanySearchField({ value, onSearch }: Props) {
  return (
    <TextField
      size="small"
      label="Company"
      placeholder="Search by name…"
      slotProps={{ inputLabel: { shrink: true } }}
      value={value}
      onChange={(event) => onSearch(event.target.value)}
      sx={{ flex: 1, minWidth: 220 }}
    />
  );
}
