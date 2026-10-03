import { Button, MenuItem, Stack, Tab, Tabs, TextField } from '@mui/material';

import { PRIORITY_LABELS, STATUS_LABELS } from '@/lib/submission-labels';
import { Broker, SubmissionListFilters, SubmissionPriority, SubmissionStatus } from '@/lib/types';

import { CompanySearchField } from './CompanySearchField';

const ALL = 'all';

interface Props {
  filters: SubmissionListFilters;
  onChange: (changes: Partial<SubmissionListFilters>) => void;
  onClear: () => void;
  brokers: Broker[] | undefined;
  brokersLoading: boolean;
}

export function FilterBar({ filters, onChange, onClear, brokers, brokersLoading }: Props) {
  const hasActiveFilters = Boolean(
    filters.status || filters.priority || filters.brokerId || filters.companySearch,
  );

  return (
    <Stack spacing={2}>
      {/* Status is the primary triage axis, so it gets one-click tabs instead of a dropdown. */}
      <Tabs
        value={filters.status ?? ALL}
        onChange={(_, value: string) =>
          onChange({ status: value === ALL ? undefined : (value as SubmissionStatus) })
        }
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          minHeight: 40,
          '& .MuiTab-root': { minHeight: 40 },
        }}
      >
        <Tab value={ALL} label="All" />
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <Tab key={value} value={value} label={label} />
        ))}
      </Tabs>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }}>
        <CompanySearchField
          value={filters.companySearch ?? ''}
          onSearch={(companySearch) => onChange({ companySearch: companySearch || undefined })}
        />
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
          sx={{ minWidth: 150 }}
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
          sx={{ minWidth: 240 }}
        >
          <MenuItem value="">All brokers</MenuItem>
          {brokers?.map((broker) => (
            <MenuItem key={broker.id} value={String(broker.id)}>
              {broker.name}
            </MenuItem>
          ))}
        </TextField>
        {hasActiveFilters && (
          <Button onClick={onClear} sx={{ whiteSpace: 'nowrap' }}>
            Clear filters
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
