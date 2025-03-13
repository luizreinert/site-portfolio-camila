import React, { useEffect } from "react";
import Footer from '../components/Footer/Footer.jsx'
import AllPhotoSessions from "../components/Portfolio/AllPhotoSessions.jsx";

export function Ensaios (){
    useEffect(() => {
        document.body.classList = ''
    })
    return(
        <>
            <AllPhotoSessions /> 
            <Footer />
        </>
    )
}