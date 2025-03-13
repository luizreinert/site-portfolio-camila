// Project Components and Dependencies  
import { useState, useEffect } from 'react';  
import { Link, useNavigate } from 'react-router-dom';  
import { useInView } from 'react-intersection-observer';  
import { Swiper, SwiperSlide } from 'swiper/react';  
import { Navigation } from 'swiper/modules';  
import axios from 'axios';  

// Styles  
import 'swiper/css';  
import "swiper/scss/navigation";  
import './Portfolio.css';  

// Config  
import { API_URL } from '../../constants/config';  


const Portfolio = () => {
  const navigate = useNavigate()

  // Listen for viewport width changes and update `matches` state
  const [smallDevice, setSmallDevice] = useState(window.matchMedia('(max-width: 992px)'))
  useEffect(() => {
    // Sets the inital state based on the device size
    const media = window.matchMedia('(max-width: 992px)');
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
  
  /** In-view settings for the homepage porfolio section title */
  const [portfolioTitleObserver, setPortfolioTitleObserver] = useState(false)

  const { ref: portfolioTitleRef, inView : portfolioTitleInView } = useInView({
    threshold: 0.4,
    triggerOnce: true,
    skip: portfolioTitleObserver,
    onChange: (portfolioTitleInView) => {
      if (portfolioTitleInView){
        sessionStorage.setItem('portfolioTitleObserverShown', 'true')
      }
    }
  })
  
  useEffect(() => {
    if (sessionStorage.getItem('portfolioTitleObserverShown') === 'true'){
      setPortfolioTitleObserver(true)
    } 
  }, [])

  /** In-view settings for the homepage portfolio section photocards */
  const [portfolioPhotocardsObserver, setPortfolioPhotocardsObserver] = useState(false)

  const { ref: portfolioPhotocardsRef, inView : portfolioPhotocardsInView} = useInView({
    threshold: 0.5,
    triggerOnce: true,
    skip: portfolioPhotocardsObserver,
    onChange: (portfolioPhotocardsInView) => {
      if (portfolioPhotocardsInView){
        sessionStorage.setItem('portfolioPhotocardsObserverShown', 'true')
      }
    }
  })

  useEffect(() => {
    if (sessionStorage.getItem('portfolioPhotocardsObserverShown') === 'true'){
      setPortfolioPhotocardsObserver(true)
    } 
  }, [])

  // Adds a transition effect before navigating to the chosen photoshoot
  const navigateToModelPage = (target) => {
    document.body.classList.toggle('transition')
    setTimeout(() => {
      navigate(target)
    }, 500);
  }

  // Fetches the home portfolio data from the API and sets the header state to the cover photo.
  const [homePortfolioData, setHomePorfolioData] = useState([]) 
  const [header, setHeader] = useState()
  const getHomePortfolioData = async () => {
    try{
      const res = await axios.get(`${API_URL}/home`)
      setHomePorfolioData(res.data)
      setHeader(res.data[3].cover_photo)
    } catch(error){
      console.log(error)
    }

  }

  useEffect(() => {
    getHomePortfolioData()
  }, [setHomePorfolioData])

  return(
    <div id='portfolio' className='portfolio'>
      <div ref={portfolioTitleRef} className="divider">
        <h1 className={`title ${portfolioTitleInView ? 'title-shown' : portfolioTitleObserver ? 'title' : 'title-hidden'} `}>Portfolio</h1>
      </div>
      <div ref={portfolioPhotocardsRef} className={`portfolio-mosaic-container ${portfolioPhotocardsInView ? 'porfolio-photocards-shown' : portfolioPhotocardsObserver ? 'photo-card-showed' : 'porfolio-photocards-hidden'}`}>
      {homePortfolioData.length > 0 && (
        <Swiper
        modules={[Navigation]}
        style={{
          "--swiper-navigation-color" : "#C0825F",
          "--swiper-navigation-size" : "60px",
          "--swiper-navigation-sides-offset": "40px"
        }}
        navigation={smallDevice ? false : true}
        zoom={true}
        centeredSlides={true}
        grabCursor={true}
        initialSlide={0}
        touchEventsTarget={'container'}
        slideToClickedSlide={true}
        slidesPerView={smallDevice ? 1 : 4}
        spaceBetween={smallDevice ? 20 : 100}
        loop={true}
        className='homepage-portfolio-swiper' 
      >
        {homePortfolioData.map((essay, index) =>
        (
          <SwiperSlide className='home-slide' key={index}>
              <div className={`mobile-photocard-wrapper `}>
                <img
                key={index}
                loading='lazy'
                alt={essay.essay_title}
                src={essay.cover_photo}
                className={`photo-card-m `}
                onClick={() => navigateToModelPage(`/ensaio/${essay.client_name}`)}>
                </img>
                <div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                <div className='photo-infos'>
                  <h1>{essay.essay_title}</h1>
                </div>
              </div>
          </SwiperSlide>
          )
        )}
        <SwiperSlide className='last-home-slide'>
          <div className='mobile-photocard-wrapper'>
            <div onClick={() => navigateToModelPage(`/portfolio`)}  className={`photo-card-m last-photo-card ${portfolioPhotocardsInView ? 'porfolio-photocards-shown' : portfolioPhotocardsObserver ? 'photo-card-showed' : 'porfolio-photocards-hidden'}`}  style={{backgroundImage: `url(${header})`}}>
            <h1 className='last-photo-card-text'>Portfolio completo</h1>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      )}  
      </div>
      <div className='portfolio-btn-wrapper'>
        <Link to="/portfolio">
          Ver todos os ensaios
          <span>
            <ion-icon name="arrow-forward-outline"></ion-icon>
          </span>
        </Link>
      </div>
    </div>
  )
}

export default Portfolio