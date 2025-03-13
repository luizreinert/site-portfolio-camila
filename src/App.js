import './index.css'
import { React } from 'react'
import {BrowserRouter as Router, Routes, Route, ScrollRestoration, useLocation } from 'react-router-dom'
import { Home } from './pages/home.js'
import { ModelPage}  from './pages/modelPage.js'
import ScrollToTop from './components/Portfolio/ScrollToTop.js'
import { Ensaios } from './pages/essays.js'
import { DashboardPage } from './pages/dashboardPage.js'
import { LoginPage } from './pages/loginPage.js'

function App(){
  return(
    <Router>
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />}/>
        <Route path="/sobre" element={<Home />}/>
        <Route path="/portfolio" element={<Ensaios />}/>
        <Route path="/ensaio/:name" element={<ModelPage />} />
        <Route path="/contato" element={<Home />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/dashboard" element={<DashboardPage />}/>
      </Routes>
    </Router>
  )
}

export default App