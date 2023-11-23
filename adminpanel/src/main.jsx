import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './hooks/auth/useAuth'
import App from "./App"
import { PrimeReactProvider } from "primereact/api";

import Tailwind from 'primereact/passthrough/tailwind';

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
      <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
      </BrowserRouter>
    </PrimeReactProvider>
  </React.StrictMode>,
)
