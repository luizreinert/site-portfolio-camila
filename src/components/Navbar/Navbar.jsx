// Project Components and Dependencies
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Assets
import logoName from '../../assets/images/logos/navbar-logo.webp';
import logoBrown from '../../assets/images/logos/logo-brown.webp';
import logoWhite from '../../assets/images/logos/logo-round.webp';

// Styles
import './Navbar.css';

// Navbar component used for the homepage, with different styles according to the device
export const IndexNavbar = () => {
  const [NavActivated, setNavActivated] = useState(false);

  const openModal = () => {
    if (NavActivated === false){
      document.body.classList.add('modal-nav');
      setNavActivated(true);
    } else {
      document.body.classList.remove('modal-nav');
      setNavActivated(false);
    }
  };

  const [smallDevice, setSmallDevice] = useState(window.matchMedia('(max-width: 992px)').matches);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 992px)');

    // Sets the inital state based on the device size
    setSmallDevice(media.matches);

    const handleResize = () => {
      setSmallDevice(media.matches);
      document.body.classList.remove('modal-nav');
    };

    // Listener for the resize
    media.addEventListener('change', handleResize);

    return () => {
      media.removeEventListener('change', handleResize);
    };
  }, []);

  const [scrollUp, setScrollUp] = useState(true)

  useEffect(() => {
    const currentPage = window.location.href
    if (currentPage.includes('model') === false && currentPage.includes('portfolio') === false){
      var firstScroll = 0
      const handleScroll = () => {
        var secondScroll = window.scrollY
        if (secondScroll > firstScroll) {
          setScrollUp(false);
        } else if (secondScroll < firstScroll && secondScroll > 100){
          setScrollUp(true);
        } else if (secondScroll < 100) {
          setScrollUp(true)
        }
        firstScroll = secondScroll 
      };
  
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const [navShow, setNavShow] = useState(smallDevice)

  // Handle the scroll event for the navbar animation
  const navBarHandle = () => {
    var firstscroll = 0
    window.addEventListener('scroll', () => {
      const second = window.scrollY
      if (smallDevice){
        if (window.scrollY < 100){
          setNavShow(true)
        } else{
          setNavShow(false)
        }
      } else {
        if (second > firstscroll){
          setNavShow(false)
        } else if(firstscroll > second && window.scrollY > 100){
          setNavShow(true)
        } else {
          setNavShow(false)
        }
      }
      firstscroll = second
    })
  }

  useEffect(() => {
    navBarHandle();
  });

  if (smallDevice) {
    return(
      <div className={`${navShow && smallDevice ? 'nav-show' : 'nav-hidden'} navbar`}>
        <a className='nav-logo' href='/'>
          <div className="custom-logo d-flex d-lg-none">
            <img width={70} height={70} alt='Logo Camila Balestra Fotografias' src={logoWhite}></img>
          </div>       
        </a>
        <button aria-label="Abrir menu de navegação" onClick={() => openModal()} id="nav-icon" className={`nav-toggler ${NavActivated === true ? 'open' : 'closed'} ${scrollUp ? 'nav-toggler-up' : 'nav-toggler-down'} `}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className={`nav-menu ${NavActivated ? 'nav-menu-show' : 'nav-menu-hidden'} `}>
          <div className='navbar-container'>
            <Link to={"/"}>
              <span onClick={() => openModal()}>início</span>
            </Link>
            <Link to={"/sobre"}>
              <span onClick={() => openModal()}>sobre</span>
            </Link>
            <Link to={"/portfolio"}>
              <span onClick={() => openModal()}>portfolio</span>
            </Link>
            <Link to={"/contato"}>
              <span onClick={() => openModal()}>contato</span>
            </Link>
            <li className='nav-menu-social-media'>
              <a href='https://www.instagram.com/camilabfotografias/' rel="noreferrer" target='_blank'>
                <ion-icon name="logo-instagram"></ion-icon>
              </a>
              <a href='https://www.linkedin.com/in/camila-balestra-zacarkin-358618293' rel="noreferrer" target='_blank'>
                <ion-icon name="logo-linkedin"></ion-icon>
              </a>
              <a href='https://api.whatsapp.com/send/?phone=5544998196010&text&type=phone_number&app_absent=0' rel="noreferrer" target='_blank'>
                <ion-icon name="logo-whatsapp"></ion-icon>
              </a>
            </li>
          </div>
        <div className='copyright'>
          <span>© 2024 Camila Balestra. Todos os direitos reservados</span><br/>
            <span>Desenvolvido por</span>&nbsp;
            <a href='https://www.github.com/luizreinert'>Luiz Reinert</a>
        </div>
      </div>
    </div>
    )
  } else {
    return(
      <div className={`nav-show navbar-desktop`}>
        <div role='button' onClick={() => window.scrollTo(0, 0)} className='navbar-desktop-logo'>
          <img width={80} height={80} alt='Logo Camila Balestra Fotografias' src={logoBrown}></img>
        </div>
        <div className='navbar-desktop-container'>
          <Link to={"/"}>
            <span>início</span>
          </Link>
          <Link to={"/sobre"}>
            <span >sobre</span>
          </Link>
          <Link to={"/portfolio"}>
            <span >portfolio</span>
          </Link>
          <Link to={"/contato"}>
            <span >contato</span>
          </Link>
        </div>
      </div>
    )
  }

}

export const OtherNavbar = ({customClass}) => {
  const [NavActivated, setNavActivated] = useState(false);

  // Function to add or remove the modal class
  const openModal = () => {
    if (NavActivated === false){
      document.body.classList.add('modal-nav');
      setNavActivated(true);
    } else {
      document.body.classList.remove('modal-nav');
      setNavActivated(false);
    }
  };

  const [smallDevice, setSmallDevice] = useState(window.matchMedia('(max-width: 992px)').matches);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 992px)');

    // Sets the inital state based on the device size
    setSmallDevice(media.matches);

    const handleResize = () => {
      setSmallDevice(media.matches);
    };

    // Listen for changes to the media query
    media.addEventListener('change', handleResize);

    return () => {
      media.removeEventListener('change', handleResize);
    };
  }, []);

  if (smallDevice){
    return(
      <div className={`navbar-model navbar ${customClass} `}>
        <a className='nav-logo' href='/'>
            <div className="custom-logo d-flex d-lg-none">
            <h1>Camila balestra</h1>
            <span>FOTOGRAFIAS</span>
          </div>
        </a>
          <button aria-label="Abrir menu de navegação" onClick={() => openModal()} id="nav-icon" className={`nav-toggler ${NavActivated === true ? 'open' : 'closed'}`}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className={`nav-menu ${NavActivated ? 'nav-menu-show' : 'nav-menu-hidden'} `}>
          <div className='navbar-container'>
            <Link to={"/"}>
              <span onClick={() => openModal()}>início</span>
            </Link>
            <Link to={"/sobre"}>
              <span onClick={() => openModal()}>sobre</span>
              </Link>
            <Link to={"/portfolio"}>
              <span onClick={() => openModal()}>portfolio</span>
            </Link>
            <Link to={"/contato"}>
              <span onClick={() => openModal()}>contato</span>
            </Link>
            <div className='nav-menu-social-media'>
              <a href='https://www.instagram.com/camilabfotografias/' rel="noreferrer" target='_blank'>
                <ion-icon name="logo-instagram"></ion-icon>
              </a>
              <a href='https://www.linkedin.com/in/camila-balestra-zacarkin-358618293' rel="noreferrer" target='_blank'>
                <ion-icon name="logo-linkedin"></ion-icon>
              </a>
              <a href='https://api.whatsapp.com/send/?phone=5544998196010&text&type=phone_number&app_absent=0' rel="noreferrer" target='_blank'>
                <ion-icon name="logo-whatsapp"></ion-icon>
              </a>
            </div>
          </div>
          <div className='copyright'>
            <span>Camila Balestra Zacarkin © 2024 <br/> Todos os direitos reservados</span><br/>
              <span>Desenvolvido por</span>&nbsp;
              <a href='https://www.github.com/luizreinert'>Luiz Reinert</a>
          </div>
        </div>
      </div>
    )
  } else if (smallDevice === false && window.location.pathname !== "/" ) {
    return(
      <div className={`navbar-model ${customClass} navbar`}>
        <Link to='/'>
          <img fetchpriority="high" width={350} src={logoName} alt='Logo Camila Balestra Fotografias'/>
        </Link>
        <div className='navbar-desktop-container'>
          <Link to={"/"}>
            <span>início</span>
          </Link>
          <Link to={"/sobre"}>
            <span>sobre</span>
          </Link>
          <Link to={"/portfolio"}>
            <span>portfolio</span>
          </Link>
          <Link to={"/contato"}>
            <span>contato</span>
          </Link>
        </div>
      </div>
    )
  }
}
