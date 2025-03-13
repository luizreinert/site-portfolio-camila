// Project Components and Dependencies
import React, { useCallback, useEffect, useState } from "react";
import { IndexNavbar } from "../Navbar/Navbar";

// Assets
import Logo from '../../assets/images/logos/logo-round.webp';
import LogoTeste from '../../assets/images/logos/test-logo.webp';

// Styles
import './Hero.css';

const Hero = () => {
  // Listen for viewport width changes and update the `smallDevice` state.
  const [smallDevice, setSmallDevice] = useState(window.matchMedia('(max-width: 992px)').matches)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 992px)');
    
    const handleResize = (e) => {setSmallDevice(e.matches)};

    media.addEventListener('change', handleResize);
    return () => 
      media.removeEventListener('change', handleResize);
   
  }, []);


  // Function for the scroll down button on hero section
  const scrollOnClick = () => {
    setScrollTriggered('down')
    setTimeout(() => {
      window.scrollTo({top: window.innerHeight, behavior: "smooth"})
      document.body.classList.remove('modal-nav');
    }, 600);
  }


  //  State to track if it's the user's first time entering the page, using session storage to track reloading.
  const [firstEnter, setFirstEnter] = useState(() => {
    return sessionStorage.getItem('firstEnter') === null
  })

  useEffect(() => {
    if (sessionStorage.getItem('firstEnter') === null) {
      sessionStorage.setItem('firstEnter', 'false');
    }
  });

  
  const [scrollTriggered, setScrollTriggered] = useState("")

  // Function for the wheel event on hero section
  const heroWheel = (e) => {
    if (!smallDevice){
      if (e.deltaY > 0 && window.scrollY === 0){
        setScrollTriggered("down")
        setTimeout(() => {
          document.body.classList.remove('modal-nav')
          window.scrollTo({top: window.innerHeight, behavior: "smooth"})
        }, 1000);
      } else if (e.deltaY < 0 && window.scrollY <= 100 && scrollTriggered === "down") {
        setScrollTriggered("up")
        document.body.classList.add('modal-nav')
      }
    }
  }

  // Memoize the wheel event handler with useCallback
  const handleWheel = useCallback((e) => {
    if (e.deltaY < 0 && window.scrollY < 600 && scrollTriggered === "down") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setScrollTriggered('up');
    }
  }, [scrollTriggered]);

  /*Memoize the scroll event handler with useCallback. When the user is outside the hero section and the page scrolls to the top,
   the scrollTriggered state updates to 'up'. This triggers the hero section animation and displays its title and heading.*/
  const handleScroll = useCallback((e) => {
    if (window.scrollY === 0 && scrollTriggered != null){
      setScrollTriggered('up');
      document.body.classList.add('modal-nav');
    }
  }, [scrollTriggered])

  // Hook that adds the wheel and scroll events for the hero section if the device isn't mobile
  useEffect(() => {
    if (!smallDevice) {
      document.addEventListener('wheel', handleWheel);
      document.addEventListener('scroll', handleScroll);
      return () => {
        document.removeEventListener('wheel', handleWheel)  
        document.removeEventListener('scroll', handleScroll);}
    }
  }, [smallDevice, handleWheel, handleScroll]);

  // If the user reloads the page outside the hero section, the scroll down state will be triggered.
  useEffect(() => {
    setTimeout(() => {
      if (window.scrollY > 600) {
        setScrollTriggered('down')
        document.body.classList.remove('modal-nav');
      }
    }, 1000);
    if (!smallDevice && window.scrollY === 0){
      document.body.classList.add('modal-nav');
    } 
  }, [smallDevice])

  if (smallDevice) {
    return(
      <div className="hero-section">
        <IndexNavbar />
        <div className="hero-section-mobile">
          <div className="picture-frame">
            <div className="hero-heading">
              <h1>registros leves de <span>mulheres</span> em suas mais diversas fases </h1>
              <button aria-label="Descer página" onClick={() => scrollOnClick()} className="hero-section-button-mobile">
                <ion-icon className="test" expand="full" name="arrow-down-outline"></ion-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return(
      <>
        <div className={`hero-section ${scrollTriggered === "down" ? 'scroll-down-triggered' : ''} ${scrollTriggered === "up" ? 'scroll-up-triggered' : ''} ${firstEnter ? 'first-enter' : ''}`}>
          <IndexNavbar />
          <div className={`hero-transition-container `}>
            <div className="logo-container">
            <div className="logo-wrap">
              <img fetchpriority="high" alt="Logo Camila Balestra Fotografias" src={Logo}></img>
            </div>
            </div>
          </div>
          <div onWheel={(e) => heroWheel(e)} className="hero-main-container">
            <div className="hero-main-image-wrapper" style={{backgroundImage : `url(https://res.cloudinary.com/dygsae0m9/image/upload/v1740081815/lua-26_cwpeid.webp)`}}>      
            </div>
            <div className="hero-heading">
              <div className="hero-title-wrapper">
                <img alt="Logo Camila Balestra Fotografias" src={LogoTeste}/>
              </div>
              <div className="hero-subtitle-wrapper">
                <div className="hero-subtitle-motto">
                  <h1>registros leves de <span>mulheres</span> em suas mais diversas fases </h1>
                </div>
                <div className="scrolldown-btn-wrapper">
                  <button aria-label="Descer página" onClick={() => scrollOnClick()}>conheça meu trabalho</button>
                </div>
            </div>
            </div>
          </div>
        </div>
      </>
    )
  }
  
}

export default Hero