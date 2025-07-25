// src/pages/BAI.jsx
import React from 'react';
import Header from '../components/Header';
import "../assets/styles/header.css";
import "../assets/styles/BAI.css";
import rbt1 from "../assets/images/r1.png";

function BAI() {
  return (
    <>    
    <Header/>
      <div className='contentbai'>
        <h2 className="Subtitulo178"> ¿En qué consiste el test? </h2>
        
        <div className='ImagenSuperposicionada1'>
        <img src={rbt1} alt="Robot Nervioso" className="rbt1" />
        </div>
          <div className="textIzquierda">Esta herramienta se llama Inventario de Ansiedad de Beck (BAI)
           y está diseñada para identificar síntomas que pueden estar afectando tu bienestar.</div>

          <div className="textDerecha"></div>
            <div className="caja2bai1">El test contiene 21 afirmaciones relacionadas con 
                síntomas de ansiedad.</div>
            <div className="caja3bai2">Cada afirmación describe una sensación física o 
                emocional que podrías haber experimentado. </div>
            <div className="caja4bai3">Debes indicar con qué frecuencia la sentiste
                 durante la última semana, incluido hoy. </div> 
      
      </div> 
    </>
  );  
}

export default BAI;