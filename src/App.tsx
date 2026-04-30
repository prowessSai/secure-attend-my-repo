import '@fontsource/mulish/300.css';
import '@fontsource/mulish/400.css';
import '@fontsource/mulish/500.css';
import '@fontsource/mulish/700.css';

import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import theme from './theme/theme';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './auth/AuthProvider';
import MapsProvider from './components/MapProvider';
// import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
        <MapsProvider>
          <CssBaseline />
          {/* Optional global navigation */}
          {/* <Navbar /> */}
          <AppRoutes />
          </MapsProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
