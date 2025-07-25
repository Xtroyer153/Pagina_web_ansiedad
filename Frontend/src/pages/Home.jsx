// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import robotImg from "../assets/images/r.inicio.png";
import Swal from "sweetalert2";

function Home() {
  const navigate = useNavigate();

  const handleTestClick = () => {
    const username = localStorage.getItem("username");
    if (username) {
      navigate("/test");
    } else {
      Swal.fire({
        icon: "info",
        title: "Aviso",
        text: "Debes iniciar sesión para acceder al test",
        timer: 3000,
        showConfirmButton: false,
      }).then(() => {
        navigate("/login");
      });
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <img src={robotImg} alt="Robot Ansiedad" className="imgrobot" />
        <div className="contenido">
          <div className="titulo">TEST DE<br />ANSIEDAD</div>
          <div className="subtitulo">A NIVEL UNIVERSITARIO</div>
          <div className="descripcion">
            ¿Sientes ansiedad por exámenes o carga universitaria?<br />
            Descubre tu nivel con nuestro test rápido y gratuito. ¡Empieza ahora!
          </div>
          <button className="btn-test" onClick={handleTestClick}>
            Iniciar Test
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;