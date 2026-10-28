import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { printConsoleWelcomeBanner, setupGlobalDomActionLogger } from './utils/actionLogger.js'
import { reduxStore } from './store/redux/store.js'

// Print master console welcome banner with Action, Session and JWT monitors
printConsoleWelcomeBanner();

// Setup global DOM listener so every click & form submit is logged to console
setupGlobalDomActionLogger();

if (typeof window !== 'undefined') {
  window.__TITANIC_REDUX__ = reduxStore;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
