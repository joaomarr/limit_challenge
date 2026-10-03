import { Box, Link, Stack, Typography } from '@mui/material';

import { formatDate } from '@/lib/format';
import { Document } from '@/lib/types';

import { DetailSection, EmptySectionText } from './DetailSection';

export function DocumentsSection({ documents }: { documents: Document[] }) {
  return (
    <DetailSection title="Documents" count={documents.length}>
      {documents.length === 0 ? (
        <EmptySectionText>No documents attached.</EmptySectionText>
      ) : (
        <Stack component="ul" spacing={1.5} sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {documents.map((document) => (
            <Stack
              component="li"
              key={document.id}
              direction="row"
              spacing={1.5}
              alignItems="flex-start"
            >
              <DocTypeBadge type={document.docType} />
              <Box sx={{ minWidth: 0 }}>
                {document.fileUrl ? (
                  <Link
                    href={document.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    color="text.primary"
                    sx={{ fontWeight: 600, display: 'block' }}
                  >
                    {document.title} <span aria-hidden>↗</span>
                  </Link>
                ) : (
                  <Typography fontWeight={600}>{document.title}</Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  {document.docType} · {formatDate(document.uploadedAt)}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      )}
    </DetailSection>
  );
}

function DocTypeBadge({ type }: { type: string }) {
  return (
    <Box
      aria-hidden
      sx={{
        width: 32,
        height: 38,
        flexShrink: 0,
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.default',
        display: 'grid',
        placeItems: 'center',
        fontSize: '0.6rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        color: 'text.secondary',
      }}
    >
      {type.slice(0, 3).toUpperCase()}
    </Box>
  );
}
