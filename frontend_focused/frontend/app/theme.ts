'use client';

import { createTheme } from '@mui/material';

const displayFamily = 'var(--font-display), Georgia, serif';

export const theme = createTheme({
  palette: {
    primary: { main: '#1f4d3f' },
    error: { main: '#b3401e' },
    warning: { main: '#a86a12' },
    success: { main: '#2f6b3a' },
    background: { default: '#f5f3ee', paper: '#fffefb' },
    text: { primary: '#1d1c1a', secondary: '#6b675f' },
    divider: '#e2ded4',
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: 'var(--font-body), system-ui, sans-serif',
    h1: {
      fontFamily: displayFamily,
      fontWeight: 500,
      fontSize: '2.5rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: displayFamily,
      fontWeight: 500,
      fontSize: '1.75rem',
      letterSpacing: '-0.01em',
    },
    h3: { fontFamily: displayFamily, fontWeight: 500, fontSize: '1.25rem' },
    overline: { fontWeight: 600, letterSpacing: '0.12em', fontSize: '0.7rem' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { border: '1px solid #e2ded4' } },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontSize: '0.7rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#6b675f',
          backgroundColor: '#faf8f3',
        },
        root: { borderColor: '#ece8df' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: { root: { backgroundColor: '#fffefb' } },
    },
  },
});

export const monoFontFamily = 'var(--font-mono), ui-monospace, monospace';
