// Project Components and Dependencies
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// Project Components
import { OtherNavbar } from '../Navbar/Navbar.jsx';
import TransitionLoader from '../Others/TransitionLoader.jsx';

// Swiper Components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation, Zoom, Pagination, Virtual } from 'swiper/modules';

// Project Configuration
import { API_URL } from '../../constants/config.js';

// Styles
import './Model.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/virtual';
import "swiper/css/zoom";
import "swiper/css/pagination";

const Model = () => {
  const { name } = useParams();
  const navigate = useNavigate();

  // State for storing essay details
  const [targetEssayData, setTargetEssayData] = useState([]);

  // Fetches essay details
  const getTargetEssayData = async () => {
    try {
      const res = await axios.get(`${API_URL}/essays`);
      setTargetEssayData(res.data.targetEssayInfos[name]);
    } catch (error) {
      console.log(error);
    }
  };

  // State for storing Cloudinary images
  const [images, setImages] = useState([]);

  // Fetches images from Cloudinary
  const getCloudinaryImages = async () => {
    try {
      const res = await axios.get(`${API_URL}/get-images?folder=${name}`);
      setImages(res.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  useEffect(() => {
    getCloudinaryImages();
  }, [setImages]);

  useEffect(() => {
    getTargetEssayData();
  }, [setTargetEssayData]);

  const targetModel = targetEssayData;

  const [loading, setLoading] = useState(true);

  // Waits for both API requests to resolve before proceeding
  const loadData = async () => {
    try {
      await Promise.all([getCloudinaryImages(), getTargetEssayData()]);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Listen for viewport width changes and update `matches` state
  const [smallDevice, setSmallDevice] = useState(window.matchMedia('(max-width: 992px)').matches);
  useEffect(() => {
    let mediaQuery = window.matchMedia('(max-width: 992px)');
    const handleChange = (event) => {
      setSmallDevice(event.matches);
    };
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const [fullScreen, setFullScreen] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [sliderActivated, setSliderActivated] = useState(false);

  // Function to toggle fullscreen mode for the image slider
  const openModal = () => {
    if (!sliderActivated) {
      window.scrollTo(0, 0);
      document.body.classList.add('modal-nav');
      setFullScreen(true);
      setSliderActivated(true);
    } else {
      document.body.classList.remove('modal-nav');
      setThumbsSwiper(null);
      setFullScreen(false);
      setSliderActivated(false);
    }
  };

  // Swiper reference and state for tracking slide position
  const swiperRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(1);

  // Handles navigation back to the portfolio page with a transition effect
  const [returnPortfolio, setReturnPortfolio] = useState(false);
  const navigateToPortfolioPage = () => {
    setReturnPortfolio(true);
    setTimeout(() => {
      navigate('/portfolio');
    }, 500);
  };

  return(
    <>
    <OtherNavbar customClass={fullScreen ? 'navbar-carousel-handler' : ''} />
    <div className={`model-portfolio ${fullScreen ? 'portfolio-full-screen' : 'portfolio-normal'}`}>
      {loading ? (
        <TransitionLoader loaderType='propagate' navbar={true} />
      ) : (
        <>
        <div className='carousel-overlay'></div>
        <div className={`portfolio-img-wrapper ${returnPortfolio && 'return-portfolio'}`}>
          {!fullScreen ? (
          <>
            {smallDevice ? (
              <>
                <h1 className='photoshoot-title'>{targetModel && targetModel.essay_title}</h1>
                <div className='photoshoot-navigation'>
                  <button onClick={() => navigateToPortfolioPage()}>
                    <ion-icon name="return-up-back-outline"></ion-icon>
                  </button>
                  <span>{currentSlide} / {swiperRef.current?.swiper?.slides.length}</span>
                </div>
                <Swiper
                  ref={swiperRef}
                  style={{
                    "--swiper-navigation-color": "var(--primary-bg)", 
                    "--swiper-pagination-inactive-color" : "var(--break-line-color)",
                    "--swiper-pagination-color" : "var(--secondary-bg)",
                  }}
                  modules={[Thumbs, Navigation, Zoom, Pagination]}
                  zoom={true}
                  touchEventsTarget={'swiper-wrapper'}
                  pagination={{
                    type: "bullets",
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  grabCursor={true}
                  centeredSlides={true}
                  slidesPerView={1}
                  thumbs={{ swiper: thumbsSwiper }}
                  rewind={true}
                  className='swiper-model'
                  onSlideChange={() => setCurrentSlide(swiperRef.current.swiper.activeIndex + 1)}
                  >
                  {images.map((photo, mobileIndex) => (
                    <SwiperSlide key={mobileIndex} virtualIndex={mobileIndex}>
                      <div className="swiper-zoom-container portfolio-img-inner">
                        <img src={photo} alt={photo} loading='lazy'></img>
                        <div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                      </div>
                  </SwiperSlide>
                  ))}
                </Swiper>
                <div className='pagination-wrapper'></div>
              </>
            ) : (
              <button aria-label='Ver ensaio completo' onClick={() => openModal()} className='portfolio-img-inner swiper-model' style={{backgroundImage: `url(${images[0]})`}}>
                <h1>Ver ensaio completo</h1>
              </button>
            )}
          </>
          ) : (
            <>
              <div className='full-screen-btn-wrapper'>
                <button onClick={() => openModal()}>
                  <ion-icon name="scan-outline"></ion-icon>
                </button>
              </div>
              <>
                <Swiper
                  style={{'--swiper-navigation-color': 'var(--primary-bg)'}}
                  modules={[Thumbs, Navigation, Zoom, Virtual]}
                  virtual={{enabled:true, preloadImages:false}}
                  zoom={true}
                  grabCursor={true}
                  lazy={true}
                  navigation={true}
                  centeredSlides={true}
                  slidesPerView={1}
                  thumbs={{ swiper: thumbsSwiper }}
                  rewind={true}
                  className='main-slider'
                > 
                  {images.map((photo, photoIndex) => (
                    <SwiperSlide key={photoIndex} virtualIndex={photoIndex}>
                      <div className="swiper-zoom-container">
                        <img src={photo}  width={1920} height={1080} alt={`Foto ${photoIndex} do ensaio da ${name}`} loading='lazy'></img>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <Swiper
                modules={[Thumbs, Virtual]}
                slidesPerView={10}
                virtual={true}
                grabCursor={true}
                spaceBetween={20}
                onSwiper={setThumbsSwiper}
                className='thumbs-slider'
                >
                  {images.map((thumbPhoto, thumbsIndex) => (
                    <SwiperSlide key={thumbsIndex} virtualIndex={thumbsIndex}>
                      <img src={thumbPhoto} width={200} height={100} alt={`Foto ${thumbsIndex} do ensaio da ${name}`} loading='lazy'></img>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            </>
          )}
        </div>
        <div className={`${returnPortfolio && 'return-portfolio'} photoshoot-text ${fullScreen ? 'photoshoot-text-hidden' : 'photoshoot-text-shown'}`}>
          {!smallDevice && (
              <h1 className='photoshoot-title'>{targetModel && targetModel.essay_title}</h1>
            )}
          <p>{targetModel && targetModel.essay_description}</p>
          <button onClick={() => navigateToPortfolioPage()} >
            <ion-icon name="arrow-back-outline"></ion-icon>
            Ver outros ensaios
          </button>
        </div>
      </>
      )}
      
    </div>
    </>
  )
}

export default Model

