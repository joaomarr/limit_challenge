import { MenuItem, Pagination, Select, Stack, Typography } from '@mui/material';

import { PAGE_SIZE_OPTIONS } from '@/lib/hooks/useSubmissions';

interface Props {
  page: number;
  pageSize: number;
  total: number | undefined;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

// Always rendered (even with a single page) so the table area never changes height.
export function PaginationFooter({ page, pageSize, total, onPageChange, onPageSizeChange }: Props) {
  const pageCount = total ? Math.ceil(total / pageSize) : 1;
  const first = total ? (page - 1) * pageSize + 1 : 0;
  const last = total ? Math.min(page * pageSize, total) : 0;

  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ minHeight: 40 }}>
      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
        {total ? `Showing ${first}–${last} of ${total}` : ' '}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2" color="text.secondary" id="rows-per-page-label">
          Rows per page
        </Typography>
        <Select
          size="small"
          variant="standard"
          disableUnderline
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          inputProps={{ 'aria-labelledby': 'rows-per-page-label' }}
          sx={{ fontSize: '0.875rem', fontWeight: 600 }}
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Pagination
        page={Math.min(page, pageCount)}
        count={pageCount}
        disabled={pageCount <= 1}
        onChange={(_, nextPage) => onPageChange(nextPage)}
        shape="rounded"
        size="small"
      />
    </Stack>
  );
}
