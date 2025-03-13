import React, { useEffect } from 'react'
import '../index.css'
import Hero from '../components/HeroSection/Hero.jsx'
import About from '../components/About/About.jsx'
import Portfolio from '../components/Portfolio/Portfolio.jsx'
import Contato from '../components/Contato/Contato.jsx'
import Footer from '../components/Footer/Footer.jsx'

export function Home() {
  return(
  <>
    <Hero />
    <About />
    <Portfolio />
    <Contato />
    <Footer/>
  </>
  )
}


