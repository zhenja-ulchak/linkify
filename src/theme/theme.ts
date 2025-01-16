// theme.ts
import { createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode: 'light' | 'dark') => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#1976d2' },
          background: { default: '#ffffff', paper: '#f5f5f5' },
        }
      : {
          primary: { main: '#90caf9' },
          background: { default: '#121212', paper: '#1d1d1d' },
        }),
  },
});

export const createAppTheme = (mode: 'light' | 'dark') =>
  createTheme(getDesignTokens(mode));
