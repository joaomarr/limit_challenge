import { Box, Stack, Tooltip, Typography } from '@mui/material';

import { formatDate, formatRelative } from '@/lib/format';
import { NoteDetail } from '@/lib/types';

import { DetailSection, EmptySectionText } from './DetailSection';

export function NotesTimeline({ notes }: { notes: NoteDetail[] }) {
  return (
    <DetailSection title="Notes" count={notes.length}>
      {notes.length === 0 ? (
        <EmptySectionText>No notes yet.</EmptySectionText>
      ) : (
        // Newest first (API order), matching the "latest note" shown in the list.
        <Stack component="ol" spacing={0} sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {notes.map((note, index) => (
            <Box
              component="li"
              key={note.id}
              sx={{ display: 'grid', gridTemplateColumns: '32px 1fr', columnGap: 1.5 }}
            >
              <Stack alignItems="center">
                <Initials name={note.authorName} />
                {index < notes.length - 1 && (
                  <Box sx={{ flex: 1, width: '1px', bgcolor: 'divider', my: 0.5 }} />
                )}
              </Stack>
              <Box sx={{ pb: index < notes.length - 1 ? 3 : 0, minWidth: 0 }}>
                <Stack direction="row" spacing={1} alignItems="baseline">
                  <Typography fontWeight={600}>{note.authorName}</Typography>
                  <Tooltip title={formatDate(note.createdAt)}>
                    <Typography variant="body2" color="text.secondary">
                      {formatRelative(note.createdAt)}
                    </Typography>
                  </Tooltip>
                </Stack>
                <Typography sx={{ mt: 0.5, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {note.body}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      )}
    </DetailSection>
  );
}

function Initials({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <Box
      aria-hidden
      sx={{
        width: 32,
        height: 32,
        flexShrink: 0,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        fontSize: '0.75rem',
        fontWeight: 700,
        color: 'primary.main',
        bgcolor: '#e4ece8',
      }}
    >
      {initials}
    </Box>
  );
}
