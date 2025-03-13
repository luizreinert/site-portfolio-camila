// Frameworks, Libraries and Middlewares
import { useState, useEffect } from 'react';
import { UploadIcon, X, PlusCircle as CirclePlus, Edit, Search, Trash, Pencil } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from 'axios';

// Project Components and Dependencies
import TransitionLoader from '../Others/TransitionLoader.jsx';
import { API_URL } from '../../constants/config';

// Styles
import 'swiper/css';
import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.css';

const DashboardInput = ({ title, inputType, func, setTags, setUploadedImages, value, testTags, tagsOptions}) => {
  const [tagsData, setTagsData] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [dropdownTag, setDropdownTag] = useState('essayTypes');

  useEffect(() => {
    if (testTags) {
      setSelectedTags(testTags)
    }
  }, [testTags]);

  useEffect(() => {
    if (tagsOptions) {
      setTagsData(tagsOptions);
    }
  }, [tagsOptions]);

  // Function to toggle a filter and add it to selected tags
  const toggleFilter = (filter, e) => {
    e.preventDefault();
    if (!filter) return;

    const formattedFilter = filter === 'azulClaro' ? 'azul claro' : filter;
    if (!selectedTags?.length) {
      setSelectedTags([formattedFilter]);
      setTags([formattedFilter]);
    } else if (selectedTags.includes(formattedFilter)) {
      const filtered = selectedTags.filter(currentFilter => currentFilter !== formattedFilter);
      setSelectedTags(filtered);
      setTags(filtered);
    } else {
      setSelectedTags([...selectedTags, formattedFilter]);
      setTags([...selectedTags, formattedFilter]);
    }
  };

  // Function to remove a filter from selected tags
  const removeFilter = (filter, e) => {
    e.preventDefault();
    const filtered = selectedTags.filter(currentFilter => currentFilter !== filter);
    setSelectedTags(filtered);
    setTags(filtered);
  };

  if (inputType === "text") {
    return (
      <div className="input-form-group">
        <label htmlFor="client-name" className="input-label">{title}</label>
        <input onChange={func} id="client-name" value={value} name="Nome da cliente" required type="text" />
      </div>
    );
  }

  if (inputType === "textarea") {
    return (
      <div className="input-form-group">
        <label htmlFor="page-text" className="input-label">{title}</label>
        <textarea onChange={func} id="page-text" value={value} name="page_text" required rows={10} />
      </div>
    );
  }

  if (inputType === "tags") {
    return (
      <div className="tags-container">
        <div className="input-form-group">
          <label htmlFor="tags" className="input-label">{title}</label>
          <select onChange={(e) => setDropdownTag(e.target.value)} className="dropdown-tags">
            <option value="essayTypes">Tipo de ensaio</option>
            <option value="ageGroup">Idade</option>
            <option value="colors">Cores</option>
          </select>
        </div>
        <div className="available-tags">
          {(dropdownTag === 'essayTypes' || dropdownTag === 'ageGroup') && 
            tagsData[dropdownTag]?.map(type => (
              <button
                key={type}
                className={`tag ${selectedTags?.includes(type) ? 'selected' : ''}`}
                onClick={(e) => toggleFilter(type, e)}
              >
                {selectedTags?.includes(type) ? `✓ ${type}` : type}
              </button>
            ))
          }
          {dropdownTag === 'colors' && 
            tagsData.colors && 
            Object.entries(tagsData.colors).map(([color, hex]) => (
              <button
                key={color}
                className="tag"
                style={{ backgroundColor: hex, color: '#e7e7e7' }}
                onClick={(e) => toggleFilter(color, e)}
              >
                {selectedTags.includes(color) ? `✓ ${color}` : color}
              </button>
            ))
          }
        </div>
        {selectedTags?.length > 0 && (
          <div className="selected-tags-container">
            <span>Tags selecionadas:</span>
            <div className="chosen-tags">
              {selectedTags.map((tag, index) => (
                <button
                  key={index}
                  className="selected-tag"
                  style={{ backgroundColor: tagsData.colors[tag]}}
                  onClick={(e) => removeFilter(tag, e)}
                >
                  X {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (inputType === "uploadImages") {
    return (
      <div className="upload-images-outer">
        <div className="upload-images-container">
          <div className="container-inner">
            <UploadIcon className="icon" size={70} color="#adadad" />
          </div>
          <div className="upload-text">
            <label htmlFor="images">
              <input
                id="images"
                multiple
                accept="image/webp, image/png, image/jpeg, image/jpg"
                name='images'
                onChange={(e) => setUploadedImages(e.target.files)}
                type="file"
              />
              Importar arquivos
            </label>
          </div>
          <span className="file-extension">Arquivos de imagem de até 5Mb</span>
        </div>
      </div>
    );
  }

  return null;
};

const Management = ({ funcEdit, funcCreate, activated }) => (
  <div className="management-container">
    <h5 className="management-section-title">O que deseja fazer?</h5>
    <div className="management-options-container">
      <button className={`management-button ${activated === 'create' ? 'active' : ''}`} onClick={funcCreate}>
        <CirclePlus size={20} />
        Criar novo ensaio
      </button>
      <button className={`management-button ${activated === 'edit' ? 'active' : ''}`} onClick={funcEdit}>
        <Edit className="icon" size={20} />
        Editar ensaio existente
      </button>
    </div>
  </div>
);

const EditPage = ({ data, tagsData, token }) => {
  const [chosenEssay, setChosenEssay] = useState(null);
  const [dropdownActive, setDropdownActive] = useState(false);
  const [inputSearchValue, setInputSearchValue] = useState('');
  const [apiFetched, setApiFetched] = useState(false);
  const [teste, setTeste] = useState([]);

  const [clientName, setClient] = useState('');
  const [pageTitle, setTitle] = useState('');
  const [pageText, setText] = useState('');
  const [pageTags, setTags] = useState([]);

  const [confirmPopup, setConfirmPopup] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);

  useEffect(() => {
    if (tagsData) {
      setTeste(tagsData);
    }
  }, [tagsData]);

  // Fetches the essays data
  useEffect(() => {
    if (chosenEssay) {
      setApiFetched(true)
      setClient(chosenEssay.client_name);
      setTitle(chosenEssay.essay_title);
      setText(chosenEssay.essay_description);
      setTags(chosenEssay.chosen_tags);
    }
  }, [chosenEssay]);

  // Handles the input search for pre-existing essays
  const handleInputSearch = (value) => {
    setInputSearchValue(value);
    setDropdownActive(value.length > 0);
  };

  // Handles the target essay choosing
  const handleChoseEssay = (target) => {
    setChosenEssay(target);
    setInputSearchValue(target.essay_title.replace('Ensaio da ', ''));
    setDropdownActive(false);
  };

  // Handles the form delete submission
  const deleteEssay = async (target) => {
    if (onSubmit) return

    if (!target){
        toast.error('Selecione um ensaio para deletar');
      return
    }
    setConfirmPopup(false)
    setOnSubmit(true)

    try {
      await axios.delete(`${API_URL}/delete-client-page?targetClient=${target}`, {
        headers: {
            'Authorization': `Bearer ${token}`
      }});
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao deletar ensaio');
    } finally {
      setOnSubmit(false);
      setInputSearchValue('');
      toast.success('Ensaio deletado com sucesso');
    }

  }

  // Handles the form edit submission
  const editHandler = async (e) => {
    e.preventDefault()
    if (onSubmit) return

    setOnSubmit(true)

    if (!clientName || !pageTitle || !pageText || !pageTags) {
      toast.error('Preencha todos os campos');
      setOnSubmit(false);
      return;
    }
    const editInfosData = new FormData();
    editInfosData.append('pageTags', JSON.stringify(pageTags));
    editInfosData.append('pageTitle', pageTitle);
    editInfosData.append('pageText', pageText);
    editInfosData.append('clientName', clientName);

    try {
      await axios.put(`${API_URL}/edit-client-page`, editInfosData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
      }});
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao postar ensaio');
    } finally {
      setOnSubmit(false);
      toast.success('Ensaio editado com sucesso');
    }
  }

  if (onSubmit) {
    return (
      <>
          <TransitionLoader loaderType='puff' navbar={false} message={'Enviando informações...'} />
      </>
    )
  }

  return (
    <div className="dashboard-inner">
      <div className="dashboard-inner-title-wrapper">
        <h1>Editar ensaio existente</h1>
      </div>
      <ToastContainer />
      {confirmPopup && (
          <div className="confirm-popup-container">
          <div>
            <span>Tem certeza que deseja deletar esse ensaio?</span>
            <div className="confirm-popup-buttons">
              <button className='cancel' onClick={() => setConfirmPopup(false)}>Cancelar</button>
              <button className='confirm' onClick={() => deleteEssay(clientName)}>Deletar</button>
            </div>
          </div>
        </div>
      )}
      <div className="dashboard-inner-body">
        <div className="essays-dropdown">
          <div className="search-container">
            <Search color="#757575" className="search-icon" size={20} />
            <input
              type="text"
              onBlur={() => setTimeout(() => setDropdownActive(false), 200)}
              onFocus={() => setDropdownActive(true)}
              onChange={(e) => handleInputSearch(e.target.value)}
              value={inputSearchValue}
              placeholder="Procurar ensaios..."
              className="search-input"
            />
          </div>
          {dropdownActive && (
            <ul className="dropdown-options-container">
              {data
                .filter((essay) =>
                  essay.essay_title.toUpperCase().includes(inputSearchValue.toUpperCase())
                )
                .map((essay) => (
                  <li
                    key={essay.id}
                    onMouseDown={() => handleChoseEssay(essay)}
                    className="dropdown-option"
                  >
                    {essay.essay_title.replace("Ensaio da ", "")}
                  </li>
                ))}
              {data.filter((essay) => essay.essay_title.toUpperCase().includes(inputSearchValue.toUpperCase())).length === 0 && (
                <li className="dropdown-option no-results">
                  Não foram encontrados ensaios correspondendo à sua pesquisa.
                </li>
              )}
            </ul>
          )}
        </div>
        {inputSearchValue && apiFetched && (
          <form className="edit-essays-form" onSubmit={editHandler}>
            <DashboardInput title="Nome da cliente" inputType="text" func={(e) => setClient(e.target.value)} value={clientName} />
            <DashboardInput title="Título" inputType="text" func={(e) => setTitle(e.target.value)} value={pageTitle} />
            <DashboardInput title="Texto" inputType="textarea" func={(e) => setText(e.target.value)} value={pageText} />
            <DashboardInput title="Tags do post" inputType="tags" setTags={setTags} testTags={pageTags} tagsOptions={teste}/>
            <div className="submit-container">
              <button type="submit" className="submit-button">
                <Pencil size={20} color="#fff" />
                <span>Salvar ensaio</span>
              </button>
              <button onClick={() => setConfirmPopup(true)} type="button" className="delete-button">
                <Trash size={20} color="#fff" />
                <span>Deletar ensaio</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const CreatePage = ({token, tagsData}) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [clientName, setClient] = useState('');
  const [pageTitle, setTitle] = useState('');
  const [pageText, setText] = useState('');
  const [pageTags, setTags] = useState([]);
  const [onSubmit, setOnSubmit] = useState(false);

  const [fetchedTagsData, setFetchedTagsData] = useState([]);

  useEffect(() => {
    if (tagsData) {
      setFetchedTagsData(tagsData);
    }
  }, [tagsData]);

  // Prevents the user from scrolling when the form is being submitted
  useEffect(() => {
    document.body.style.overflow = onSubmit ? 'hidden' : 'visible';
  }, [onSubmit]);

  // Handles the form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    if (onSubmit) return;
  
    setOnSubmit(true);
  
    if (!clientName || !pageTitle || !pageText || !pageTags || uploadedImages.length === 0) {
      toast.error('Preencha todos os campos');
      setOnSubmit(false);
      return;
    }
  
    Array.from(uploadedImages).forEach(file => {
      if (file.size > 5242880) {
        toast.error('Cada imagem deve ter no máximo 5MB');
        setOnSubmit(false);
        return;
      }
    });
  
    const clientInfosData = new FormData();
    clientInfosData.append('pageTags', JSON.stringify(pageTags));
    clientInfosData.append('pageTitle', pageTitle);
    clientInfosData.append('pageText', pageText);
    clientInfosData.append('clientName', clientName);
  
    try {
      // Sends the client infos to the database
      const response = await axios.post(`${API_URL}/post-client-page`, clientInfosData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
  
      // If the request was successful, upload the images to Cloudinary
      if (response.status === 200) {
        await axios.post(`${API_URL}/verify-token`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const cloudinaryUploadPromises = Array.from(uploadedImages).map(image => {
          const formData = new FormData();
          formData.append('file', image);
          formData.append('folder', clientName);
          formData.append('upload_preset', 'ml_default');
  
          return axios.post('https://api.cloudinary.com/v1_1/dygsae0m9/image/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        });
  
        // Wait for all Cloudinary uploads to complete
        const cloudinaryResponses = await Promise.all(cloudinaryUploadPromises);
  
        // Updates the cover photo URL of the essay in the database
        const coverPhotoUrl = cloudinaryResponses[0].data.secure_url;
        await axios.post(`${API_URL}/update-cover-photo`, {
          clientName,
          coverPhotoUrl
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        toast.success('Ensaio postado com sucesso!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao postar ensaio');
      console.log(error)
    } finally {
      setOnSubmit(false);
    }
  };

  // Function to handle uploaded images removal
  const removeImage = (e, index) => {
    e.preventDefault();
    const updatedImages = Array.from(uploadedImages);
    updatedImages.splice(index, 1);
    setUploadedImages(updatedImages);
  };

  return (
    <div className="dashboard-inner">
      <div className="dashboard-inner-title-wrapper">
        <h1>Adicionar ensaio</h1>
      </div>
      <ToastContainer />
      {onSubmit && <TransitionLoader loaderType={'puff'} message={'Enviando ensaio...'}/>}
      <div className="dashboard-content">
        <form onSubmit={submitHandler}>
          <DashboardInput
            func={(e) => setClient(e.target.value)}
            title="Nome da cliente"
            inputType="text"
          />
          <DashboardInput
            func={(e) => setTitle(e.target.value)}
            title="Título do ensaio"
            inputType="text"
          />
          <DashboardInput
            func={(e) => setText(e.target.value)}
            title="Texto"
            inputType="textarea"
          />
          <DashboardInput
            setTags={setTags}
            title="Tags do post"
            inputType="tags"
            tagsOptions={fetchedTagsData}
          />
          <DashboardInput
            setUploadedImages={setUploadedImages}
            title="Importar imagens"
            inputType="uploadImages"
          />

          {uploadedImages.length > 0 && (
            <div className="uploaded-images">
              <Swiper
                slidesPerView="auto"
                spaceBetween={10}
                className="swiper-container"
              >
                {Array.from(uploadedImages).map((image, index) => (
                  <SwiperSlide key={index} className="uploaded-image-slide">
                    <div className="uploaded-images-wrapper">
                      <button onClick={(e) => removeImage(e, index)}>
                        <X size={25} className="icon" />
                      </button>
                      <img src={URL.createObjectURL(image)} alt={`Imagem ${index}`} />
                      <span>{image.name}</span>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          <button type="submit" className="submit-button post">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

const App = () => {
  const [managementOption, setManagementOption] = useState('create');
  const [essaysData, setEssaysData] = useState([]);
  const [tagsData, setTagsData] = useState([]);
  const [validToken, setValidToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null); // Define token as a state variable

  useEffect(() => {
    const fetchEssays = async () => {
      try {
        const res = await axios.get(`${API_URL}/portfolio`);
        setEssaysData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEssays();
  }, []);

  useEffect(() => {
    const getTagsData = async () => {
      try {
        const res = await axios.get(`${API_URL}/filters`);
        setTagsData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getTagsData();
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const tokenFromStorage = localStorage.getItem('token');
        setToken(tokenFromStorage); // Update token state variable
        if (!tokenFromStorage) {
          alert('Você precisa estar logado para acessar!');
          window.location.href = '/login';
          return;
        }
        const response = await axios.post(`${API_URL}/verify-token`, { token: tokenFromStorage });
        if (!response.data.valid) {
          alert('Token inválido!');
          localStorage.removeItem('token');
          window.location.href = '/login';
          return false;
        }
        setValidToken(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, []);

  if (loading) {
    return (
      <TransitionLoader loaderType={'puff'} navbar={false} message={'Carregando...'}/>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>
      <Management
        funcEdit={() => setManagementOption('edit')}
        funcCreate={() => setManagementOption('create')}
        activated={managementOption}
      />
      {managementOption === 'create' ? (
        <CreatePage token={token} tagsData={tagsData} />
      ) : (
        <EditPage data={essaysData} tagsData={tagsData} token={token}/>
      )}
    </div>
  );
};

export default App;