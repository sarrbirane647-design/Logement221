import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import "./styles/responsive.css";
import ScrollToTop from './components/ScrollToTop.jsx'

import { PropertyProvider } from './context/PropertyContext.jsx'
import { UserProvider } from './context/UserContext.jsx'


createRoot(document.getElementById('root')).render(



    <BrowserRouter>

  <ScrollToTop />

      <PropertyProvider>

        <UserProvider>

          <App />

        </UserProvider>

      </PropertyProvider>

    </BrowserRouter>

  

)