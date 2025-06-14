import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import '../src/pages/Login/project/src/index.css';
import { AuthProvider } from './context/AuthContext'; // ✅ import

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
