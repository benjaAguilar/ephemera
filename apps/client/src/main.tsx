import { StrictMode } from 'react';
import { Hero } from './pages/Hero';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { AuthProvider } from './auth/AuthProvider';
import App from './App';
import { ProtectRoute } from './auth/ProtectRoute';

const root = document.getElementById('root');

ReactDOM.createRoot(root!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Hero />} />
          <Route path="app" element={<ProtectRoute />}>
            <Route index element={<App />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
