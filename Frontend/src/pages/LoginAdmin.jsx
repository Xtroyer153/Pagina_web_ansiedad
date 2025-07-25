// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Header from "../components/Header";
import "../assets/styles/login.css";
import robotImg from "../assets/images/r2.png";
import userIcon from "../assets/images/user.png";
import Swal from "sweetalert2";
import useGlobalUIHandlers from "../scripts/useGlobalUIHandlers";

function LoginAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  useGlobalUIHandlers();

  const [admin, setUsername] = useState("");
  const [passwordAdmin, setPassword] = useState("");

  // Mostrar alerta si viene con ?msg=login_required
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("msg") === "login_required") {
      Swal.fire("Aviso", "Debes iniciar sesión para acceder al test", "info");
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/loginAdmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ admin, passwordAdmin }),
      });

      if (res.ok) {
        Swal.fire("¡Bienvenido!", "Has iniciado sesión exitosamente.", "success");
        navigate("/AdminEstadisticas");
      } else {
        Swal.fire("Error", "Usuario o contraseña incorrectos", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Hubo un problema con el servidor", "error");
    }
  };

  return (
    <>
      <Header />
      <div className="login-contenedor">
        <img src={robotImg} alt="Robot Ansiedad" className="login-img" />
        <div className="formularioDeIngreso">
          <div className="login-icon">
            <img src={userIcon} alt="Icono de usuario" />
          </div>
          <h2 className="tituloLogin">Administrador</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Admin"
              required
              value={admin}
              onChange={(e) => setUsername(e.target.value)}
            />

            <div className="input-con-icono">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Contraseña"
                required
                value={passwordAdmin}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="cajaRecuerda">
              <label> </label>
            </div>

            <button type="submit">Ingresar</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginAdmin;