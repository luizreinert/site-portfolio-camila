import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const heroSection = document.querySelector('.hero-section')
    const aboutSection = document.querySelector('.about')
    const portfolioSection = document.querySelector('.portfolio')
    const contactSection = document.querySelector('.contato')

    if (pathname.startsWith("/ensaio") || pathname.startsWith("/portfolio")){
      document.documentElement.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      })
    } else if (pathname === "/"){
      window.scrollTo({top: 0, behavior: "smooth", inline: 'start', block: "start"})
    } else if (pathname.startsWith("/sobre")){
      aboutSection.scrollIntoView({behavior: "smooth", inline: 'start', block: "start"})
    } else if (pathname.startsWith("/contato")){
      contactSection.scrollIntoView({behavior: "smooth", inline: 'start', block: "start"})
    } 
  }, [pathname]);

  return null;

}