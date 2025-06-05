import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './Products page.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);