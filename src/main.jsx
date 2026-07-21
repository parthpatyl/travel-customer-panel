import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AgencyProvider } from './context/AgencyContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AgencyProvider>
      <App />
    </AgencyProvider>
  </StrictMode>,
)
