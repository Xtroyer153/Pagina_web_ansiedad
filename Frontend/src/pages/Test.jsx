// src/pages/Test.jsx
import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "../assets/styles/test.css";
import robotPresentacion from "../assets/images/r6.png";
import robotFinal from "../assets/images/r5.png";
import cara1 from "../assets/images/cara1.png";
import cara2 from "../assets/images/cara2.png";
import cara3 from "../assets/images/cara3.png";
import cara4 from "../assets/images/cara4.png";
import useGlobalUIHandlers from "../scripts/useGlobalUIHandlers";

function Test() {
  useGlobalUIHandlers();

  return (
    <>
      <Header />
      <main className="test-container">
        {/* PRESENTACIÓN */}
        <section className="intro-section">
          <div className="intro-text">
            <h1>
              ¡Hola, soy <span className="bold">PSYCOBOT!</span>
            </h1>
            <h2>
              Te enseñaré como <span className="bold">responder</span>
            </h2>
            <div className="mensaje">
              Gracias por estar aquí. En este test podrás reconocer cómo te has
              sentido últimamente frente a tus estudios, actividades diarias y
              emociones. ✦
            </div>
          </div>
          <img src={robotPresentacion} alt="Robot PSYCOBOT" className="robot-img" />
        </section>

        {/* ESCALA */}
        <section className="guia-section">
          <h2>¿Cómo debo responder?</h2>
          <p>
            Para cada afirmación, deberás marcar qué tan frecuentemente te
            ocurre, usando esta escala:
          </p>
          <div className="escalas">
            <div className="emoji-opcion">
              <img src={cara1} alt="Nunca" />
              <span>NUNCA</span>
            </div>
            <div className="emoji-opcion">
              <img src={cara2} alt="Casi nunca" />
              <span>CASI NUNCA</span>
            </div>
            <div className="emoji-opcion">
              <img src={cara3} alt="A veces" />
              <span>A VECES</span>
            </div>
            <div className="emoji-opcion">
              <img src={cara4} alt="Casi siempre" />
              <span>CASI SIEMPRE</span>
            </div>
          </div>

          <p className="frase-final">
            Estoy contigo en este proceso. Recuerda{" "}
            <strong>“No hay respuestas correctas o incorrectas"</strong>. Solo
            sé honesto contigo mismo. ¿Listo para empezar?
          </p>

          <div className="botones-finales">
            <Link to="/" className="btn-regresar">
              ⬅ REGRESAR
            </Link>
            <Link to="/test/pregunta/1" className="btn-empezar">
              EMPEZAR ➤
            </Link>
          </div>

          <img src={robotFinal} alt="Robot feliz" className="robot-img-bajo" />
        </section>
      </main>
    </>
  );
}

export default Test;