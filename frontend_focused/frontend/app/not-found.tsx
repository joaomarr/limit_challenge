import { Box, Button, Typography } from '@mui/material';

export default function NotFound() {
  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', py: 16, px: 2, textAlign: 'center' }}>
      <Typography variant="h2" component="h1">
        Page not found
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        The address doesn&apos;t match any page in the submission tracker.
      </Typography>
      {/* Server Component: pass a plain href, not component={Link} (a function can't
          cross the server/client boundary into MUI's client Button). */}
      <Button href="/submissions" variant="outlined" sx={{ mt: 3 }}>
        Go to submissions
      </Button>
    </Box>
  );
}
