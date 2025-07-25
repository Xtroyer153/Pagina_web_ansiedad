// src/pages/Consejo.jsx
import React from "react";
import Header from "../components/Header";
import "../assets/styles/consejo.css";
import roboCorazon from "../assets/images/r6.png";

function Historias() {
  return (
    <>
      <Header />

      <div className="container">
        <img src={roboCorazon} alt="Robot Corazón" className="robocora" />
        <div className="content">
          {/* Aquí puedes insertar el contenido del consejo o algún mensaje diario */}
          <h2>Consejo del Día</h2>
          <p>
            Tómate un momento para respirar profundamente y recordar que estás haciendo tu mejor esfuerzo.
            La ansiedad no te define, pero tu valentía sí. 🌱
          </p>
        </div>
      </div>
    </>
  );
}

export default Historias;