import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './Context/AuthContext.tsx'
import { ThemeProvider } from './Context/ThemeContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
    <AuthProvider>
    <Router>
    <App />
    </Router>
    </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
