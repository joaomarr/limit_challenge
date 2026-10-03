import { Button, MenuItem, Stack, Tab, Tabs, TextField } from '@mui/material';

import { PRIORITY_LABELS, STATUS_LABELS } from '@/lib/submission-labels';
import { Broker, SubmissionListFilters, SubmissionPriority, SubmissionStatus } from '@/lib/types';

import { CompanySearchField } from './CompanySearchField';

const ALL = 'all';

interface Props {
  filters: SubmissionListFilters;
  onChange: (changes: Partial<SubmissionListFilters>) => void;
  onClear: () => void;
  onCompanySearch: (companySearch: string) => void;
  brokers: Broker[] | undefined;
  brokersLoading: boolean;
}

export function FilterBar({
  filters,
  onChange,
  onClear,
  onCompanySearch,
  brokers,
  brokersLoading,
}: Props) {
  const hasActiveFilters = Boolean(
    filters.status || filters.priority || filters.brokerId || filters.companySearch,
  );

  return (
    // One toolbar row on wide screens (tabs left, filters right) so the table keeps
    // most of the viewport; stacked on narrower screens.
    <Stack
      direction={{ xs: 'column', lg: 'row' }}
      spacing={2}
      alignItems={{ lg: 'flex-end' }}
      justifyContent="space-between"
      sx={{ borderBottom: { lg: 1 }, borderColor: { lg: 'divider' }, pb: { lg: 1.5 } }}
    >
      {/* Status is the primary triage axis, so it gets one-click tabs instead of a dropdown. */}
      <Tabs
        value={filters.status ?? ALL}
        onChange={(_, value: string) =>
          onChange({ status: value === ALL ? undefined : (value as SubmissionStatus) })
        }
        sx={{
          borderBottom: { xs: 1, lg: 0 },
          borderColor: 'divider',
          minHeight: 40,
          mb: { lg: -1.5 },
          '& .MuiTab-root': { minHeight: 40, minWidth: 0, px: 2 },
        }}
      >
        <Tab value={ALL} label="All" />
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <Tab key={value} value={value} label={label} />
        ))}
      </Tabs>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.5}
        alignItems={{ md: 'center' }}
        sx={{ flex: { lg: 1 }, justifyContent: 'flex-end', maxWidth: { lg: 880 } }}
      >
        <CompanySearchField value={filters.companySearch ?? ''} onSearch={onCompanySearch} />
        <Stack direction="row" spacing={1.5}>
          <TextField
            select
            size="small"
            label="Priority"
            value={filters.priority ?? ''}
            onChange={(event) =>
              onChange({
                priority: (event.target.value || undefined) as SubmissionPriority | undefined,
              })
            }
            slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
            sx={{ minWidth: 150, flex: { xs: 1, md: 'none' } }}
          >
            <MenuItem value="">Any priority</MenuItem>
            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Broker"
            value={brokers ? (filters.brokerId ?? '') : ''}
            onChange={(event) => onChange({ brokerId: event.target.value || undefined })}
            disabled={brokersLoading}
            slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
            sx={{ minWidth: { xs: 0, md: 220 }, flex: { xs: 1, md: 'none' } }}
          >
            <MenuItem value="">All brokers</MenuItem>
            {brokers?.map((broker) => (
              <MenuItem key={broker.id} value={String(broker.id)}>
                {broker.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        {/* Hidden rather than unmounted so the row doesn't reflow when it appears. */}
        <Button
          onClick={onClear}
          sx={{ whiteSpace: 'nowrap', visibility: hasActiveFilters ? 'visible' : 'hidden' }}
          tabIndex={hasActiveFilters ? 0 : -1}
        >
          Clear filters
        </Button>
      </Stack>
    </Stack>
  );
}
