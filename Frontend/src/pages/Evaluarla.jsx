// src/pages/Evaluarla.jsx
import React from 'react';

import Header from '../components/Header';
import "../assets/styles/header.css";
import "../assets/styles/Evaluarla.css";
import rbt10 from "../assets/images/img10.png";


function Evaluarla() {
  return (
   <>
    <Header/>
     <div className='contentene'>
        <div className='ImagenSuperposicionada1'>
        <img src={rbt10} alt="Robot Nervioso" className="rbt10" />
        </div>
        <div className="textContent"></div>
          <div className="Subtitulo12"> ¿Por qué evaluarla?</div>
          <div className="caja1eva">Evaluar la ansiedad a tiempo es clave para prevenir que 
            se convierta en un problema grave. La investigación indica que la ansiedad y 
            el estrés prolongados pueden afectar significativamente el rendimiento académico 
            y la calidad de vida</div>
          <div className="caja2eva">Esta evaluación temprana te ayudará a tomar decisiones 
            conscientes: por ejemplo, aplicar técnicas de manejo del estrés, buscar apoyo 
            emocional o ajustar tus hábitos diarios antes de que la ansiedad te abrume.</div>
          <div className="caja3eva">Reconocer los síntomas de ansiedad y buscar ayuda oportuna es 
            fundamental para afrontarlos con éxito. Al realizar el test de Mente UNFV te permitirá 
            obtener el resultado de tu estado actual. </div>
    </div>    
   </>
  );
}

export default Evaluarla;