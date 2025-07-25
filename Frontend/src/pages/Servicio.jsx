// src/pages/Consejo.jsx
import React from "react";
import Header from "../components/Header";
import "../assets/styles/Servicio.css";
import robooso from "../assets/images/osito.png";

function Servicio() {
  return (
    <>
    <Header/>
     <div className='content'>
        <div className='ImagenSuperposicionada102'>
        <img src={robooso} alt="Robot Nervioso" className="robooso" />
        </div>
          
          <div className="contenedor-titulo">
            <h1 className="titulo-centrado">Servicios de apoyo en la UNFV 🙌</h1>
          </div>
          <div className="textContentpy"></div>
            <div className="caja1py">La Universidad ofrece recursos institucionales para 
              cuidar la salud mental de sus alumnos. </div>
            <div className="caja2py">El Consultorio Psicológico de la Facultad de la FIIS 
              ofrece sesiones gratuitas con profesionales capacitados. Estos servicios 
              están pensados para acompañarte, no dudes en acercarte si crees que necesitas
               ayuda. </div>
            <div className="caja3py">La UNFV también organiza talleres y charlas sobre bienestar
               emocional; revisa los anuncios institucionales para conocer las fechas. </div>
    </div>    
   </>
  );
}

export default Servicio;