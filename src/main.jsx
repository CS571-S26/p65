import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <HashRouter>
      <App />
    </HashRouter>
  </ThemeProvider>
)
