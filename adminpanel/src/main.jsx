import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './hooks/auth/useAuth'
import App from "./App"
import { PrimeReactProvider } from "primereact/api";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrimeReactProvider>
        <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
        </BrowserRouter>
    </PrimeReactProvider>
  </React.StrictMode>,
)
