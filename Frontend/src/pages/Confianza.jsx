// src/pages/Confiar .jsx
import React from 'react';

  import Header from '../components/Header';
  import "../assets/styles/header.css";
  import "../assets/styles/Confiar.css";
  import rbt55 from "../assets/images/r5.png";

function Confianza () {
  return (
    <> 
      <Header/>
        <div className='content'>
          <div className="textContent"></div>
            <div className="Subtitulo314"> 🔒 Compromiso y confianza 🔒</div>
            <div className="caja1">Con Mente UNFV podrás confiar en que recibirás 
              orientación basada en métodos formales. Somos estudiantes que 
              aprenden enseñando; este proyecto también enriquece nuestra formación 
              profesional mientras cuidamos a la comunidad.</div>
            <div className="caja2">Basado en instrumentos validados como el BAI 
              (Inventario de Ansiedad de Beck), ofrecemos una autoevaluación que 
              te orienta sobre tu estado de ansiedad y te ayuda a tomar decisiones 
              informadas sobre tu bienestar emocional.</div>
            <div className="caja3">Protegemos tu privacidad, solo solicitamos la 
              información necesaria para brindarte una orientación precisa basada 
              en resultados validados.</div>
            <div className="imaaAgeOverlay">
            <img src={rbt55} alt="Robot Nervioso" className="rbt55" />
                        <div className="Subtitulo32"> "Estamos aquí para ti, porque cuidar tu 
              bienestar también es nuestra meta"</div>
          </div>
      </div>
    </>
    );
}

export default Confianza ;
