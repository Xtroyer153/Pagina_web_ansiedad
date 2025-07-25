  import React from 'react';

  import Header from '../components/Header';
  import "../assets/styles/header.css";
  import "../assets/styles/Info.css";
  import rbtimg from "../assets/images/img9.png";

  function Info() {
    return (
    <> 
      <Header/>
        <div className='contento'>
          <div className="imageOverrlay">
            <img src={rbtimg} alt="Robot Nervioso" className="rbtImgen" />
          </div>

          <div className="textContent"></div>
            <div className="Subtitulo111"> ¿Qué es la Ansiedad?</div>
            <div className="caja1o">La ansiedad es una reacción normal 
            del cuerpo ante retos o situaciones nuevas</div>
            <div className="caja2o">Puede manifestarse como nerviosismo,
            tensión o preocupaciones, algo que todos hemos sentido al 
            prepararnos para un examen o enfrentar un problema difícil.</div>
            <div className="caja3o">En dosis moderadas, la ansiedad nos ayuda a estar
            alerta y concentrados. Sin embargo, cuando la ansiedad es muy intensa 
            o se mantiene todo el tiempo, puede perjudicar nuestra concentración,
            descanso y desempeño académico</div>
            <div className="caja4o"> Reconocerla y entenderla es el primer paso para 
            manejarla de forma saludable.</div>

      </div>
    </>
    );
  }

  export default Info;