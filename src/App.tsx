import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppRouter } from '@/presentation/router/app-router';
import { env } from '@/infrastructure/config/env';

function App() {
  return (
    <GoogleOAuthProvider clientId={env.googleClientId} locale="es">
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
