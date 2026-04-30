// theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Mulish, sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Mulish, sans-serif',
        },
      },
    },
    // Add more components here as needed
  },
});

export default theme;
