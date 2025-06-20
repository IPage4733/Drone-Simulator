import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './pages/Login/src/index.css'

import { GoogleOAuthProvider } from '@react-oauth/google'

// 🔁 Replace with your real Google Client ID
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={'917053533064-cd2a4l7jrdn27c4k0k1eoq94tkq3c0hp.apps.googleusercontent.com'}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
)
