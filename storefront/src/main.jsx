import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from'react-router-dom'
import App from './App.jsx'
import { PrimeReactProvider } from "primereact/api";
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <PrimeReactProvider value={{ unstyled: false }}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
      </PrimeReactProvider>
  </React.StrictMode>
)
