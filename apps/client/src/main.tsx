import { StrictMode } from 'react';
import { Hero } from './pages/Hero';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

const root = document.getElementById('root');

ReactDOM.createRoot(root!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Hero />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
