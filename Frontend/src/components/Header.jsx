// src/components/Header.jsx
import { Link, useLocation } from "react-router-dom";
import useGlobalUIHandlers from "../scripts/useGlobalUIHandlers";
import "../assets/styles/header.css";
import userImg from "../assets/images/user.png";
import Swal from "sweetalert2";

function Header() {
  useGlobalUIHandlers();
  const location = useLocation();
  const username = localStorage.getItem("username");

const handleLogout = () => {
  fetch("${import.meta.env.VITE_API_URL}/api/logout", {
    method: "POST",
    credentials: "include"
  })
    .then(() => {
      localStorage.removeItem("username");
      return Swal.fire({
        icon: "success",
        title: "Sesión cerrada",
        text: "Has salido correctamente de tu cuenta.",
        timer: 2000,
        showConfirmButton: false,
      });
    })
    .then(() => {
      window.location.href = "/login";
    })
    .catch((err) => {
      console.error("Error al cerrar sesión:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al cerrar sesión",
      });
    });
};

  return (
    <header className="header">
      <h1 className="logo">MENTE UNFV</h1>
      <nav className="navbar">
        <div className="center-links">
          <Link to="/">Inicio</Link>

          <div className="dropdown">
            <button className="dropbtn" onClick={() => window.togglePanel("panel1")}>
              ¿Quiénes somos?
            </button>
            <div className="dropdown-content" id="panel1">
              <Link to="/Mision">Nuestra misión y visión</Link>        
              <Link to="/Nosotros">El equipo detrás</Link>
              <Link to="/Confianza">¿Por qué confiar en nosotros?</Link>
            </div>
          </div>

          <div className="dropdown">
            <button className="dropbtn" onClick={() => window.togglePanel("panel2")}>
              Infórmate
            </button>
            <div className="dropdown-content" id="panel2">
              <Link to="/Info">¿Qué es la ansiedad?</Link>
              <Link to="/Evaluarla">¿Por qué evaluarla?</Link>
              <Link to="/BAI">¿Qué es el BAI?</Link>
            </div>
          </div>

          <div className="dropdown">
            <button className="dropbtn" onClick={() => window.togglePanel("panel3")}>
              Comunidad
            </button>
            <div className="dropdown-content" id="panel3">
              <Link to="/Consejo">Consejos de estudiantes</Link>
              <Link to="/servicio">Servicio Psicológico UNFV</Link>
            </div>
          </div>
        </div>

        <div className="right-links">
          {username ? (
            <div className="dropdown">
              {/* Añadí 'user-dropbtn' para evitar cierre accidental en el handler */}
              <button
                className="dropbtn perfil-btn user-dropbtn"
                id="perfilBtn"
                onClick={() => window.togglePanel("perfilMenu")}
              >
                {username}
                <span className="flecha">&#9662;</span>
                <img src={userImg} alt="Perfil" />
              </button>
              <div className="dropdown-content perfil-menu" id="perfilMenu">
                <Link to="/perfil">Ver Perfil</Link>
                <Link to="/test">Iniciar Test</Link>
                <Link to="/historial">Historial</Link>
                <Link to="/progreso">Progreso</Link>
                <button className="logout-link" onClick={handleLogout}>Cerrar Sesión</button>
              </div>
            </div>
          ) : (
            <>
              {location.pathname !== "/login" && <Link to="/login">Iniciar sesión</Link>}
              {location.pathname !== "/registro" && <Link to="/registro">Registrarse</Link>}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
