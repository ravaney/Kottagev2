import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const brandBlue = '#007BA7';
const brandBlueDark = '#005E80';
const brandBlueLight = '#3298BC';
const accentRaspberry = '#D155B6';
const brandFont = [
  'Playfair Display',
  'League Spartan',
  'Segoe UI',
  'Helvetica Neue',
  'Arial',
  'sans-serif',
].join(',');

let theme = createTheme({
  palette: {
    primary: {
      main: brandBlue,
      dark: brandBlueDark,
      light: brandBlueLight,
      contrastText: '#ffffff',
    },
    secondary: {
      main: accentRaspberry,
      contrastText: '#ffffff',
    },
    background: {
      default: '#F9F1F0',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: brandFont,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: {
      fontFamily: brandFont,
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--brand-primary': brandBlue,
          '--brand-font': brandFont,
        },
        'html, body, #root': {
          minHeight: '100%',
        },
        body: {
          fontFamily: brandFont,
          backgroundColor: '#F9F1F0',
        },
        'button, input, textarea, select': {
          fontFamily: brandFont,
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
