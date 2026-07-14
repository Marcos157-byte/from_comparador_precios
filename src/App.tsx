import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@/presentation/router/app-router';

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
