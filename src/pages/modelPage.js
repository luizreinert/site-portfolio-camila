import Model from '../components/Portfolio/Model.jsx'
import Footer from '../components/Footer/Footer.jsx'
import { useEffect } from 'react';

export function ModelPage() {
  useEffect(() => {
    document.body.classList = ''
  })
  return(
    <>
      <Model />
      <Footer/>
    </>
  )
}
