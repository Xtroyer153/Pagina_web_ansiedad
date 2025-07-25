import React from "react";
import Header from '../components/Header';
import "../assets/styles/consejo.css";
import moñorb from "../assets/images/moño.png";
const Consejo = () => {
  return (
   <>
    <Header/>
     <div className='content'>
        <div className='ImagenSuperposicionadacsj'>
          <img src={moñorb} alt="Robotmoño" className="moñorb" />
        </div> 
          <div className="contenedor-tituloc">
            <h1 className="titulo-centradoc">🤝CONSEJOS DE ESTUDIANTES🤝</h1>
          </div>
        <div className="textContentpy">
          <div className="caja1py">Establece una rutina equilibrada combinando estudio, 
            descanso y tiempo libre. Planificar tus días reduce la sensación de agobio.</div>
          <div className="caja2py">El ejercicio regular, una alimentación balanceada y 
            dormir al menos 7 a 8 horas cada noche fortalecen tu bienestar emocional.</div>
          <div className="caja3py">Aprende a decir “no” cuando te sientas sobrecargado. 
            Respetar tus propios límites es una forma de autocuidado esencial. </div>
          <div className="caja4py">No subestimes la importancia de la compañía. Participar 
            en grupos de estudio o actividades extracurriculares te conecta con otros y 
            fomenta el apoyo mutuo </div>
            </div>


    </div>    
   </>
  );
};

export default Consejo;