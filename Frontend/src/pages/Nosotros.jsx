// src/pages/Nosotros.jsx
import React from 'react';
  import Header from '../components/Header';
  import "../assets/styles/header.css";
  import "../assets/styles/Nosotros.css";
  import imgN5 from "../assets/images/mg5.png";

function Nosotros() {
  return (
    <> 
      <Header/>
        <div className='content'>
          <div className="imageOverlaay">
            <img src={imgN5} alt="Robot Nervioso" className="imgN5" />
          </div>

          <div className="textContent"></div>
            <div className="Subtitulo24e"> ✨ Nuestro equipo ✨</div>
            <div className="caja2zzzz">Somos estudiantes de la Facultad de 
              Ingeniería de Sistemas comprometidos con el bienestar de 
              nuestros compañeros. Conocemos bien las exigencias de la 
              vida universitaria y, por ello, hemos desarrollado esta 
              iniciativa aplicando conocimientos de tecnología y psicología. 
              Contamos con el respaldo académico de docentes especialistas 
              y seguimos metodologías validadas en psicología. De hecho, el 
              test de Mente UNFV se basa en el reconocido Inventario de 
              Ansiedad de Beck (BAI) garantizando rigor científico y utilidad.</div>

      </div>
    </>
    );
}

export default Nosotros;