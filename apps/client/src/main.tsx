import { StrictMode } from 'react';
import { Hero } from './pages/Hero';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { AuthProvider } from './auth/AuthProvider';
import { ProtectRoute } from './auth/ProtectRoute';
import { Chats } from './pages/Chats';

const root = document.getElementById('root');

ReactDOM.createRoot(root!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Hero />} />
          <Route path="chats" element={<ProtectRoute />}>
            <Route index element={<Chats />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
