// Project Components and Dependencies
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Project Components
import { OtherNavbar } from '../Navbar/Navbar';
import TransitionLoader from '../Others/TransitionLoader.jsx';

// Project Configuration
import { API_URL } from '../../constants/config';

// Styles
import './AllPhotoSessions.css';

const AllPhotoSessions = () => {
  const navigate = useNavigate();

  // Listen for viewport width changes and update `matches` state
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


  var previousSelectedFilters = JSON.parse(sessionStorage.getItem('chosenFilters'));

  const [filters, setFilters] = useState(previousSelectedFilters || []);

  // Filtered photoshoots state
  const photoshootsGridContainer = useRef(0);
  const [filteredPhotoshoots, setFilteredPhotoshoots] = useState(0);

  // useEffect to update the filtered photoshoots state
  useEffect(() => {
    setFilteredPhotoshoots(photoshootsGridContainer.current.childElementCount);
    sessionStorage.setItem('chosenFilters', JSON.stringify(filters));
  }, [filters]);
  const toggleFilter = (filter, element) => {
    var formattedFilter = filter === 'azulClaro' ? 'azul claro' : filter;
    if (filters.includes(formattedFilter)) {
      setFilters(filters.filter(currentFilter => currentFilter !== formattedFilter));
    } else {
      setFilters([...filters, formattedFilter]);
    };

  };

  const removeFilter = (filter, el) => {
    setFilters(filters.filter(currentFilter => currentFilter !== filter));
  };

  const [typeFilterOpen, setTypeFilterOpen] = useState(smallDevice ? false : true);
  const [ageFilterOpen, setAgeFilterOpen] = useState(smallDevice ? false : true);
  const [paletteFilterOpen, setPaletteFilterOpen] = useState(smallDevice ? false : true);
  const [choosePhoto, setChoosePhoto] = useState(false);

  // Function to navigate to the model page when a photoshoot is clicked
  const navigateToModelPage = (targetModel) => {
    setChoosePhoto(true);
    setTimeout(() => {
      navigate(`/ensaio/${targetModel}`);
    }, 500);
  };

  const [mobileFilter, setMobileFilter] = useState(false);

  // Function to add or remove the modal class
  const openModal = () => {
    if (mobileFilter === false) {
      document.body.classList.add('modal-nav');
      setMobileFilter(true);
    } else {
      document.body.classList.remove('modal-nav');
      setMobileFilter(false);
    };
  };


  // Functions and states to handle the mobile filter menu
  const [dragStart, setDragStart] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [topTransition, setTopTransition] = useState(false);
  const filterMenu = useRef(0);
  const dragMenu = (e) => {
    setTopTransition(false)
    setDragStart(e.touches[0].clientY);
    const deltaY = touchStart - dragStart;
    if (deltaY > 0) {
      filterMenu.current.style.top = `0px`;
    } else if (deltaY < 0) {
      filterMenu.current.style.top = `${Math.abs(deltaY)}px`;
    };
  };

  const dropMenu = (el) => {
    const touchEndValue = -(el.changedTouches[0].clientY - touchStart);
    if (touchEndValue < -170) {
      openModal();
      setTimeout(() => {
        filterMenu.current.style.top = `0px`;
      }, 600);
    } else if (touchEndValue > -170) {
      filterMenu.current.style.top = `0px`;
    }
    setTopTransition(true);
    setTimeout(() => {
      setTopTransition(false);
    }, 200);
  };

  // Function to fetch the essays data
  const [essaysData, setEssaysData] = useState([]);
  const [filtersData, setFiltersData] = useState([]);
  const getAllEssaysData = async () => {
    try{
      const res = await axios.get(`${API_URL}/portfolio`);
      setEssaysData(res.data);
    } catch(error){
      console.log(error);
    };
  };

  // Function to fetch the filters data
  const getFiltersData = async () => {
    try{
      const res = await axios.get(`${API_URL}/filters`);
      setFiltersData(res.data);
    } catch(error){
      console.log(error);
    };
  };

  const [loading, setLoading] = useState(true)

  const dataLoaded = async () => {
    try {
      await Promise.all([getAllEssaysData(), getFiltersData()]);
      setLoading(false);
    } catch (error) {
      console.error(error);
    };
  };

  useEffect(() => {
    getFiltersData();
  }, [setFiltersData]);

  useEffect(() => {
    dataLoaded();
  }, []);

  if (loading) {
    return (
      <>
          <OtherNavbar customClass={mobileFilter ? 'navbar-filter-active' : ''} />
          <TransitionLoader loaderType='propagate' navbar={true} />
      </>
    )
  }

  return (
    <>
      <OtherNavbar customClass={mobileFilter ? 'navbar-filter-active' : ''} />
      <div className='allphotosessions-main-container '>
        <div className='main-background'>
          <div className={`container-photoshoots ${choosePhoto && 'page-change-animation'}`}>
            {smallDevice ? (
              <> 
                <div className='mobile-filter-container'>
                  <button onClick={() => openModal()} className='mobile-filter-btn'>
                    <ion-icon name="funnel-outline"></ion-icon>
                  </button>
                  <div className='mobile-applied-filters'>
                    {filtersData.colors && filters.map((filter, index) => {
                      return (
                        <button
                          onClick={(e) => removeFilter(filter, e.target)}
                          key={index}
                          className='filter-keyword-tag'
                          style={{
                            backgroundColor:
                              filter !== 'azul claro' ? filtersData.colors[filter] : '#81D4FA',
                          }}
                        >
                          <span>X</span>
                          <span>{filter}</span>
                        </button>
                      );
                      })}
                  </div>
                </div>
                <div onClick={() => openModal()} className={`filter-aside-mobile-container ${mobileFilter ? 'filter-background-visible' : ''}`}>
                  <aside draggable onClick={(e) => e.stopPropagation()} ref={filterMenu} className={`filter-aside ${topTransition ? 'top-transition' : ''} ${mobileFilter ? 'filter-activated' : ''}`}>
                    <div>
                      <div 
                        draggable={true} 
                        onTouchStart={(e) => setTouchStart(e.touches[0].clientY)}
                        onTouchMove={(e) => dragMenu(e)} 
                        onTouchEnd={(e) => dropMenu(e)} 
                        className='dragabble-bar-wrapper'
                      >
                        <span className='draggable-bar'></span>
                      </div>
                      <div className='mobile-filter-main-header'>
                        <span>
                          <ion-icon name="filter-outline"></ion-icon>
                          FILTROS
                        </span>
                        <button onClick={() => setFilters([])} className='clear-filters-btn'>
                          LIMPAR
                        </button>
                      </div>
                      <hr/>
                      <div className='applied-filters-header-container'>
                          <span className='applied-filters-header'>Filtros ativos</span>
                          <span className='filter-results'>{filteredPhotoshoots} resultados</span>
                      </div>
                      <div className='filter-keywords-container'>
                          {filtersData.colors && filters.map((filter, index) => {
                            return (
                              <button
                                onClick={(e) => removeFilter(filter, e.target)}
                                key={index}
                                className='filter-keyword-tag'
                                style={{
                                  backgroundColor:
                                    filter !== 'azul claro' ? filtersData.colors[filter] : '#81D4FA',
                                }}
                              >
                                <span>X</span>
                                <span>{filter}</span>
                              </button>
                            );
                          })}
                        </div>
                      <hr />
                      <div className='checkbox-filter-container'>
                        <div onClick={() => setTypeFilterOpen(!typeFilterOpen)} role='button' className={`filter-header ${typeFilterOpen ? 'filter-arrow-down' : 'filter-arrow-up'}`}>
                          <ion-icon name="caret-up-outline"></ion-icon>
                          <span>Tipo de ensaio</span>
                        </div>
                        <ul className={`checkbox-list ${typeFilterOpen ? 'menu-shown' : 'menu-hidden'}`}>
                        {Array.isArray(filtersData.essayTypes) && filtersData.essayTypes.map((type, index) => {
                            return (
                              <li onClick={() => toggleFilter(type)} aria-label={type} key={index} role='button'>
                                <input
                                  onChange={() => toggleFilter(type)}
                                  checked={filters.includes(type)}
                                  type='checkbox'
                                />
                                <span>{type}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <hr />
                      <div className='checkbox-filter-container'>
                        <div onClick={() => setAgeFilterOpen(!ageFilterOpen)} role='button' className={`filter-header ${ageFilterOpen ? 'filter-arrow-down' : 'filter-arrow-up'}`}>
                        <ion-icon name="caret-up-outline"></ion-icon>
                          <span>Faixa Etária</span>
                        </div>
                        <ul className={`checkbox-list ${ageFilterOpen ? 'menu-shown' : 'menu-hidden'}`}>
                        {Array.isArray(filtersData.ageGroup) && filtersData.ageGroup.map((age, index) => {
                            return (
                              <li onClick={() => toggleFilter(age)} aria-label={age} key={index} role='button'>
                                <input
                                  onChange={() => toggleFilter(age)}
                                  checked={filters.includes(age)}
                                  type='checkbox'
                                />
                                <span>{age}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <hr />
                      <div className='checkbox-filter-container'>
                        <div
                          onClick={() => setPaletteFilterOpen(!paletteFilterOpen)}
                          aria-label='Paleta de cores'
                          role='button'
                          className={`filter-header ${paletteFilterOpen ? 'filter-arrow-down' : 'filter-arrow-up'}`}
                        >
                          <ion-icon name="caret-up-outline"></ion-icon>
                          <span>Paleta de cores</span>
                        </div>
                        <div className={`color-palette-container ${paletteFilterOpen ? 'menu-shown' : 'menu-hidden'}`}>
                        {filtersData.colors && Object.entries(filtersData.colors).map(([color, hex]) => {
                            return (
                              <button
                                key={color}
                                onClick={(e) => toggleFilter(color, e.target)}
                                aria-label={color}
                                className='color-palette-color'
                                style={{ backgroundColor: hex }}
                              >
                                {filters.includes(color) ? '✓' : ''}
                              </button>
                            );
                          })}
                        </div>
                        <hr />
                      </div>
                    </div>
                  </aside>
                </div>
              </>
            ) : (
              <aside className={`filter-aside ${choosePhoto && 'page-change-animation'}`}>
                <div>
                  <h1>Filtrar</h1>
                  <div>
                    <span className='applied-filters-header'>Filtros aplicados:</span>
                    <div className='filter-keywords-container'>
                      {filtersData.colors && filters.map((filter, index) => {
                        return (
                          <button
                            onClick={(e) => removeFilter(filter, e.target)}
                            key={index}
                            className='filter-keyword-tag'
                            style={{
                              backgroundColor:
                                filter !== 'azul claro' ? filtersData.colors[filter] : '#81D4FA',
                            }}
                          >
                            <span>X</span>
                            <span>{filter}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <hr />
                  <div className='checkbox-filter-container'>
                    <div onClick={() => setTypeFilterOpen(!typeFilterOpen)} role='button' className={`filter-header ${typeFilterOpen ? 'filter-arrow-down' : 'filter-arrow-up'}`}>
                      <ion-icon name="caret-up-outline"></ion-icon>
                      <span>Tipo de ensaio</span>
                    </div>
                    <ul className={`checkbox-list ${typeFilterOpen ? 'menu-shown' : 'menu-hidden'}`}>
                      {Array.isArray(filtersData.essayTypes) && filtersData.essayTypes.map((type, index) => {
                        return (
                          <li onClick={() => toggleFilter(type)} aria-label={type} key={index} role='button'>
                            <input
                              onChange={() => toggleFilter(type)}
                              checked={filters.includes(type)}
                              type='checkbox'
                            />
                            <span>{type}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <hr />
                  <div className='checkbox-filter-container'>
                    <div onClick={() => setAgeFilterOpen(!ageFilterOpen)} role='button' className={`filter-header ${ageFilterOpen ? 'filter-arrow-down' : 'filter-arrow-up'}`}>
                      <ion-icon name="caret-up-outline"></ion-icon>
                      <span>Faixa Etária</span>
                    </div>
                    <ul className={`checkbox-list ${ageFilterOpen ? 'menu-shown' : 'menu-hidden'}`}>
                      {Array.isArray(filtersData.ageGroup) && filtersData.ageGroup.map((age, index) => {
                        return (
                          <li onClick={() => toggleFilter(age)} aria-label={age} key={index} role='button'>
                            <input
                              onChange={() => toggleFilter(age)}
                              checked={filters.includes(age)}
                              type='checkbox'
                            />
                            <span>{age}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <hr />
                  <div className='checkbox-filter-container'>
                    <div
                      onClick={() => setPaletteFilterOpen(!paletteFilterOpen)}
                      aria-label='Paleta de cores'
                      role='button'
                      className={`filter-header ${paletteFilterOpen ? 'filter-arrow-down' : 'filter-arrow-up'}`}
                    >
                      <ion-icon name="caret-up-outline"></ion-icon>
                      <span>Paleta de cores</span>
                    </div>
                    <div className={`color-palette-container ${paletteFilterOpen ? 'menu-shown' : 'menu-hidden'}`}>
                      {filtersData.colors && Object.entries(filtersData.colors).map(([color, hex]) => {
                        return (
                          <button
                            onClick={(e) => toggleFilter(color, e.target)}
                            aria-label={color}
                            className='color-palette-color'
                            style={{ backgroundColor: hex }}
                          >
                            {filters.includes(color) ? '✓' : ''}
                          </button>
                        );
                      })}
                    </div>
                    <hr />
                  </div>
                </div>
              </aside>
            )}
            <div className='container-grid'>
              <div ref={photoshootsGridContainer} className='container-grid-inner'>
                {filters.length !== 0 ? (
                  essaysData.map((essay, index) => {
                    if (filters.some((filter) => essay.chosen_tags.includes(filter))) {
                      return (
                        <div
                          onClick={() => navigateToModelPage(essay.client_name)}
                          key={index}
                          className={`portfolio-photo-card appear photo-card-onhover`}
                          style={{ backgroundImage: `url(${essay.cover_photo})` }}
                        >
                          <div className='photo-overlay'>
                            <h2>{essay._title}</h2>
                            <Link className='btn-ensaio' to={`/ensaio/${essay.client_name}`}>
                              Ver ensaio
                            </Link>
                          </div>
                        </div>
                      )
                    }
                  })
                ) : (
                  essaysData.map((essay, index) => {
                    return (
                      <div
                        onClick={() => navigateToModelPage(essay.client_name)}
                        key={index}
                        className={`portfolio-photo-card appear photo-card-onhover`}
                        style={{ backgroundImage: `url(${essay.cover_photo})` }}
                      >
                        <div className='photo-overlay'>
                          <h2>{essay.essay_title}</h2>
                          <Link className='btn-ensaio' to={`/ensaio/${essay.client_name}`}>
                            Ver ensaio
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllPhotoSessions;
