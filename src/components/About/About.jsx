// Project Components and Dependencies
import { useEffect, useRef, useState } from 'react';
import { useInView } from "react-intersection-observer";

// Assets
import fotoCamila from '../../assets/images/images-camila/camila5.webp';
import fotoCamilaMobile from '../../assets/images/images-camila/camila4.webp';

// Styles
import './About.css';

const About = () => {
    const [smallDevice, setSmallDevice] = useState(window.matchMedia('(max-width: 992px)'))
    
    useEffect(() => {
      const media = window.matchMedia('(max-width: 992px)');
  
      // Sets the inital state based on the device size
      setSmallDevice(media.matches);
  
      const handleResize = () => {
        setSmallDevice(media.matches);
      };
  
      // Listener for the resize
      media.addEventListener('change', handleResize);
  
      return () => {
        media.removeEventListener('change', handleResize);
      };
    }, []);

  // In-view settings for the homepage about section title
  const [aboutObserver, setAboutObserver] = useState(false)

  const { ref: aboutTitleRef, inView : aboutInView, entry } = useInView({
    threshold: 0.9,
    triggerOnce: true,
    skip: aboutObserver,
    onChange: (aboutInView) => {
      if (aboutInView){
        sessionStorage.setItem('aboutObserverShown', 'true')
      }
    }
  })

  useEffect(() => {
    if (sessionStorage.getItem('aboutObserverShown') === 'true'){
      setAboutObserver(true)
    } 
  }, [])

  const aboutSection = useRef()


  // In-view settings for the homepage about section image 
  const [aboutImgObserver, setAboutImgObserver] = useState(false)

  const  { ref: imgRef, inView: imgInView, entry: imgEntry } = useInView({
    threshold: 0.4,
    triggerOnce: true,
    skip: aboutImgObserver,
    onChange: (aboutImgObserver) => {
      if (aboutImgObserver){
        sessionStorage.setItem('aboutImgObserverShown', 'true')
      }
    }
  })

  useEffect(() => {
    if (sessionStorage.getItem('aboutImgObserverShown') === 'true'){
      setAboutImgObserver(true)
    } 
  }, [])


  // In-view settings for the homepage about section text
  const [aboutTextObserver, setAboutTextObserver] = useState(false)

  const  { ref: aboutTextRef, inView: aboutTextInView, entry: textEntry } = useInView({
    threshold: 0.2,
    triggerOnce: true,
    skip: aboutTextObserver,
    onChange: (aboutTextObserver) => {
      if (aboutTextObserver){
        sessionStorage.setItem('aboutTextObserverShown', 'true')
      }
    }
  })

  useEffect(() => {
    if (sessionStorage.getItem('aboutTextObserverShown') === 'true'){
      setAboutTextObserver(true)
    } 
  }, [])

  // In-view settings for the insights container on about section 
  const [insightsObserver, setInsightsObserver] = useState(false)

  const  { ref: insightsRef, inView: insightsInView, entry: insightsEntry } = useInView({
    threshold: 0.2,
    triggerOnce: true,
    skip: insightsObserver,
    onChange: (insightsObserver) => {
      if (insightsObserver){
        sessionStorage.setItem('insightsObserverShown', 'true')
      }
    }
  })

  useEffect(() => {
    if (sessionStorage.getItem('insightsObserverShown') === 'true'){
      setInsightsObserver(true)
    } 
  }, [])

  
  return(
    <div ref={aboutSection} id='about' className='about'>
      <div className='about-inner'>
        <div ref={imgRef} className='about-img-wrapper d-lg-flex '>
          <img width={1080} height={720} src={ smallDevice ? fotoCamilaMobile : fotoCamila} alt='Foto da fotógrafa Camila sentada segurando uma câmera' className={`${imgInView ? 'about-img-shown' : aboutImgObserver ? 'about-img-showed': ''}`}></img>
        </div>
        <div className='about-text-wrapper'>
          <div ref={aboutTitleRef} className="divider-about">
            <h1 className={`title ${aboutInView ? 'title-shown' : aboutObserver ? 'title-showed' : 'title-hidden'} `}>Sobre mim</h1>
          </div>
          <div ref={aboutTextRef} className=' about-text'>
            <p className={`text ${aboutTextInView ? 'about-text-shown' : aboutTextObserver ? 'about-text-showed' : ''}`}>
              Fotografando desde a infância, fui descobrindo a importância dessa<span className='strong-word'>{"\u00A0"}arte{"\u00A0"}</span>na minha vida.
            </p>
            <p className={`text ${aboutTextInView ? 'about-text-shown' : aboutTextObserver ? 'about-text-showed' : ''}`}>
              Ela é a minha melhor forma de expressão. por meio dela, me sinto<span className='strong-word'>{"\u00A0"}viva{"\u00A0"}</span>e consigo revelar o meu olhar sobre as pessoas e o mundo. Ela me<span className='strong-word'>{"\u00A0"}acalma</span>, me permite exercer toda a minha<span className='strong-word'>{"\u00A0"}criatividade</span>.
            </p>
            <p className={`text ${aboutTextInView ? 'about-text-shown' : aboutTextObserver ? 'about-text-showed' : ''}`}>
              Sou apaixonada por fotografar na<span className='strong-word'>{"\u00A0"}natureza{"\u00A0"}</span>e em<span className='strong-word'>{"\u00A0"}ambientes tranquilos</span>, registrando interações genuínas que refletem a essência e a personalidade de cada pessoa..
            </p>
            <p className={`text ${aboutTextInView ? 'about-text-shown' : aboutTextObserver ? 'about-text-showed' : ''}`}>
              Se você também se identifica com uma fotografia<span className='strong-word'>{"\u00A0"}leve{"\u00A0"}</span>e<span className='strong-word'>{"\u00A0"}autêntica</span>, pode ter certeza de que vou amar ser a sua fotógrafa!
            </p>
          </div>
          <div ref={insightsRef} className={`insights-container ${insightsInView ? 'insights-container-shown' : insightsObserver ? 'insights-container-showed': ''}`}>
              <div className='insight'>
                <span className='insight-number'>+ 200</span>
                <span className='insight-text'>Ensaios <br /> realizados</span>
              </div>
              <div className='insight'>
              <span className='insight-number'>+ 4</span>
              <span className='insight-text'>Anos de <br/> experiência</span>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default About