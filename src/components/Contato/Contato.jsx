import {useForm } from 'react-hook-form'
import React from 'react'
import './Contato.css'
import { useState, useEffect} from 'react'
import { useHookFormMask } from 'use-mask-input';
import IonIcon from '@reacticons/ionicons';
import { useInView } from "react-intersection-observer";

import camilaContato from '../../assets/images/images-camila/camilaContato.webp'

export default function Contato() {

  const {register, handleSubmit, reset} = useForm()
  const teste = (data) =>{
    console.log(data)
    reset()
  }

  const [contactObserver, setContactObserver] = useState(false)

  const  { ref: contactTitle, inView} = useInView({
    threshold: 0.5,
    triggerOnce: true,
    skip: contactObserver,
    onChange: (inView) => {
      if (inView){
        sessionStorage.setItem('intersectionObserverShown', 'true')
      }
    }
  })

  useEffect(() => {
    if (sessionStorage.getItem('intersectionObserverShown') === 'true'){
      setContactObserver(true)
    }
  })

  /** In-view settings for the homepage about section image */
  const [contactImgObserver, setContactImgObserver] = useState(false)

  const  { ref: contactImgRef, inView: contactImgInView, entry: imgEntry } = useInView({
    threshold: 0.2,
    triggerOnce: true,
    skip: contactImgObserver,
    onChange: (contactImgObserver) => {
      if (contactImgObserver){
        sessionStorage.setItem('contactImgObserverShown', 'true')
      }
    }
  })

  useEffect(() => {
    if (sessionStorage.getItem('contactImgObserverShown') === 'true'){
      setContactImgObserver(true)
    } 
  }, [])

  /** In-view settings for the homepage contact section text*/
  const [contactTextObserver, setcontactTextObserver] = useState(false)

  const  { ref: contactTextRef, inView: contactTextInView, entry: textEntry } = useInView({
    threshold: 0.3,
    triggerOnce: true,
    skip: contactTextObserver,
    onChange: (contactTextObserver) => {
      if (contactTextObserver){
        sessionStorage.setItem('contactTextObserverShown', 'true')
      }
    }
  })
  
  useEffect(() => {
    if (sessionStorage.getItem('contactTextObserverShown') === 'true'){
      setcontactTextObserver(true)
    } 
  }, [])

    /** In-view settings for the homepage contact section form*/
    const [contactFormObserver, setContactFormObserver] = useState(false)

    const  { ref: contactFormRef, inView: contactFormInView, entry: FormEntry } = useInView({
      threshold: 0.3,
      triggerOnce: true,
      skip: contactFormObserver,
      onChange: (contactFormObserver) => {
        if (contactFormObserver){
          sessionStorage.setItem('contactFormObserverShown', 'true')
        }
      }
    })
    
    useEffect(() => {
      if (sessionStorage.getItem('contactFormObserverShown') === 'true'){
        setContactFormObserver(true)
      } 
    }, [])


  return(
    <section className='contato' id='contato'>
      <div ref={contactTitle} className="divider">
        <h1 className={`title ${inView ? 'title-shown' : contactObserver ? 'title-showed' : 'title-hidden'}`}>Contato</h1>
      </div>
      <div className='contato-inner'>
        <div ref={contactImgRef} className='contact-img'>
          <img width={1080} height={720} alt='Foto da fotógrafa Camila' className={`${contactImgInView ? 'contact-img-shown' : contactImgObserver ? 'contact-img-showed': ''}`} src={camilaContato}></img>
        </div>
        <div ref={contactFormRef}  className='contato-main-container'>
          <div ref={contactTextRef} className='title-wrapper'>
            <h1 className={`title-contato ${contactTextInView ? 'contact-text-shown' : contactTextObserver ? 'contact-text-showed' : ''}`}>Você vem comigo nessa?</h1>
            <p className={`subtitle-contato ${contactTextInView ? 'contact-text-shown' : contactTextObserver ? 'contact-text-showed' : ''}`}>Vamos conversar sobre como transformar suas ideias em imagens inesquecíveis!</p>
          </div>
          <div className='form-wrapper'>
            <form action="https://formsubmit.co/camilabzfotografias@gmail.com" method="POST">
              <input type="hidden" name="_captcha" value="false"></input>
              <Input customClass={contactFormInView ? 'contact-form-shown' : contactFormObserver ? 'contact-form-showed' : ''} name={"Nome"} placeholder={'Nome*'} register={register} />
              <Input customClass={contactFormInView ? 'contact-form-shown' : contactFormObserver ? 'contact-form-showed' : ''} name={"Telefone"} type={"tel"} inputmode={"numeric"} placeholder={'Telefone*'} register={register} />
              <Input customClass={contactFormInView ? 'contact-form-shown' : contactFormObserver ? 'contact-form-showed' : ''} name={"E-mail"} placeholder={'E-mail*'} type={"email"}  register={register}/>
              <Input customClass={contactFormInView ? 'contact-form-shown' : contactFormObserver ? 'contact-form-showed' : ''} name={"Cidade"} placeholder={'Cidade*'} register={register}/>
              <Input customClass={contactFormInView ? 'contact-form-shown' : contactFormObserver ? 'contact-form-showed' : ''} name={"Desc"} placeholder={'O que você espera para suas fotos?'} register={register}/>
              <div className={`submit-wrapper ${contactFormInView ? 'contact-form-shown' : contactFormObserver ? 'contact-form-showed' : ''}`}>
                <button type='submit'>Enviar</button>
              </div>
            </form>
            <p className={`contact-divider ${contactFormInView ? 'contact-form-shown' : contactFormObserver ? 'contact-form-showed' : ''}`}>ou</p>
            <div className={`whatsapp-contact-wrapper ${contactFormInView ? 'contact-form-shown' : contactFormObserver ? 'contact-form-showed' : ''}`}>
              <div className='whatsapp-contact'>
                <a href='https://api.whatsapp.com/send/?phone=5544998196010&text&type=phone_number&app_absent=0'>
                  <IonIcon size='large' name="logo-whatsapp"></IonIcon>
                  Solicitar pelo Whatsapp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )  
}

function Input({placeholder, name, register, mask, customClass, type, inputmode}){
  const [filled, setFilled] = useState(false)
  const inputChange = (value) => {
    if (value !== ''){
      setFilled(true)
    } 
  }
  const inputBlur = (value) => {
    value !== '' ? setFilled(true) : setFilled(false)
  }
  const registerWithMask = useHookFormMask(register)
  const props = mask ? registerWithMask(name, mask, {onBlur: (e) =>  inputBlur(e.target.value), onChange: (e) => {inputChange(e.target.value)} }) : register(name, {onBlur: (e) =>  inputBlur(e.target.value), onChange: (e) => {inputChange(e.target.value)} })


  const handlePhone = (e) => {
    let input = e.target
    input.value = phoneMask(input.value)
  }
  
  const phoneMask = (value) => {
    if (!value) return ""
    value = value.replace(/\D/g,'')
    value = value.replace(/(\d{2})(\d)/,"($1) $2")
    value = value.replace(/(\d)(\d{4})$/,"$1-$2")
    return value
  }

  if (name !== 'Desc' && name !== 'Telefone'){
    return(
        <div className={`input-wrapper ${customClass} `}>
          <input
            {...props}
            type={type}
            inputMode={inputmode}
            onFocus={() => setFilled(true)}
            minLength={3}
            required
            />
          <span className={filled ? "span-fill" : ''}>{placeholder}</span>
        </div>

    )
  } else if (name === 'Telefone'){
    return(
    <div className={`input-wrapper ${customClass} `}>
      <input
        {...props}
        type={type}
        inputMode={inputmode}
        onFocus={() => setFilled(true)}
        maxLength={15}
        minLength={15}
        onKeyUp={(e) => handlePhone(e)}
        required
        />
      <span className={filled ? "span-fill" : ''}>{placeholder}</span>
    </div>
    )
  }
  else {
    return(
      <div className={`textarea-wrapper ${customClass}`}>
      <textarea
        onFocus={() => setFilled(true)}
        {...props}
        />
      <span className={filled ? "span-fill" : ''}>{placeholder}</span>
    </div>
    )
  }

}
