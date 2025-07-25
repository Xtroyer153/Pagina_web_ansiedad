import React from 'react'

import Header from "../components/Header";
import "../assets/styles/mision.css";
import rbtImg from "../assets/images/r5.png";


function Mision(){
    return(
      <>
      <Header />
      <div className="container">
        <img src={rbtImg} alt="Robot Feliz" className="rbtImg"/>
        <div className="contentgus">
          <div className="subtitulo1">🎯Misión</div>
          <div className="caja1e">Mente UNFV es un proyecto creado por estudiantes 
            de Ing. de Sistemas de la UNFV para promover la salud mental entre 
            nuestros compañeros. Nuestro objetivo es ofrecerle una herramientas sencilla
             para conocer sus niveles de ansiedad y brindar orientación oportuna, fomentando 
             una comunidad universitaria saludable.</div>
          <div className="subtitulo2">💡Visión</div>
          <div className="caja2e">Buscamos ser un referente en la UNFV para la prevención de 
            la ansiedad académica, promoviendo el bienestar emocional como parte integral de la
             formación profesional. Aspiramos a que cada estudiante tenga acceso a información clara y
              apoyo cuando lo necesite.</div>
        </div>
      </div>
      </>
    );
}
export default Mision;