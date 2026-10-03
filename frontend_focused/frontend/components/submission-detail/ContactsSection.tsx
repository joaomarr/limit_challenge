import { Link, Stack, Typography } from '@mui/material';

import { Contact } from '@/lib/types';

import { DetailSection, EmptySectionText } from './DetailSection';

export function ContactsSection({ contacts }: { contacts: Contact[] }) {
  return (
    <DetailSection title="Contacts" count={contacts.length}>
      {contacts.length === 0 ? (
        <EmptySectionText>No contacts on this submission.</EmptySectionText>
      ) : (
        <Stack component="ul" spacing={2} sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {contacts.map((contact) => (
            <Stack component="li" key={contact.id} spacing={0.25} sx={{ minWidth: 0 }}>
              <Typography fontWeight={600}>{contact.name}</Typography>
              {contact.role && (
                <Typography variant="body2" color="text.secondary">
                  {contact.role}
                </Typography>
              )}
              {contact.email && (
                <Link href={`mailto:${contact.email}`} variant="body2" underline="hover" noWrap>
                  {contact.email}
                </Link>
              )}
              {contact.phone && (
                <Link
                  href={`tel:${contact.phone}`}
                  variant="body2"
                  underline="hover"
                  color="text.secondary"
                >
                  {contact.phone}
                </Link>
              )}
            </Stack>
          ))}
        </Stack>
      )}
    </DetailSection>
  );
}
