// Project Components and Dependencies
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Assets
import logo from '../../assets/images/logos/logo-round.webp';

// Styles
import './Footer.css';
const Footer = () => {
  // Avoids the footer to appear on the first render
  const [hidden, setHidden] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      setHidden(false)
    }, 1200);
  }, [])

  return(
    <div className={`footer ${hidden ? 'hidden' : ''} `}>
      <div className='footer-main'>
        <div className='logo-wrapper'>
            <img alt="Logo Camila Balestra Fotografias" src={logo}/>
        </div>
        <div className='footer-nav'>
          <h1 className='section-title'>NAVEGAR</h1>
          <div className='footer-nav-wrapper'>
            <Link to={"/"}>
              INÍCIO
            </Link>
            <Link to={"/sobre"} >
              SOBRE
            </Link>
            <Link to={"/portfolio"}>
              PORTFÓLIO
            </Link>
            <Link to={"/contato"}>
              CONTATO
            </Link>
          </div>
        </div>
        <div className='footer-contact'>
          <h1 className='section-title'>CONTATO</h1>
          <ul>
            <li>
              <ion-icon name="mail-outline"></ion-icon>
              <span>camilabzfotografias@gmail.com</span>
            </li>
            <li>
              <ion-icon name="call-outline"></ion-icon>
              <span>+44 99819-6010</span>
            </li>
          </ul>
          <div className='footer-social-media-row'>
            <a href='https://api.whatsapp.com/send/?phone=5544998196010&text&type=phone_number&app_absent=0' rel="noreferrer" target='_blank' aria-label='Link para o Whatsapp da Fotógrafa'>
              <ion-icon name="logo-whatsapp"></ion-icon>
            </a>
            <a href='https://www.linkedin.com/in/camila-balestra-zacarkin-358618293' rel="noreferrer" target='_blank' aria-label='Link para o Linkedin da Fotógrafa'>
              <ion-icon name="logo-linkedin"></ion-icon>
            </a>
            <a href='https://www.instagram.com/camilabfotografias/' rel="noreferrer" target='_blank' aria-label='Link para o Instagram da Fotógrafa'>
              <ion-icon name="logo-instagram"></ion-icon>
            </a>
            <a href='https://www.tiktok.com/@camilabfotografias' rel="noreferrer" target='_blank' aria-label='Link para o TikTok da Fotógrafa'>
              <ion-icon name="logo-tiktok"></ion-icon>
            </a>
          </div>
        </div>
      </div>
      <div className='copyright-wrapper'>
        <span>© 2024 Camila Balestra. Todos os direitos reservados</span>
        <div className='copyright'>
          <span>Desenvolvido por</span>&nbsp;
          <a className='copyright-footer-name' href='https://www.github.com/luizreinert'>Luiz Reinert</a>
        </div>
      </div>
    </div>
  )
}

export default Footer