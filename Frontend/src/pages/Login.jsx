// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Header from "../components/Header";
import "../assets/styles/login.css";
import robotImg from "../assets/images/r2.png";
import userIcon from "../assets/images/user.png";
import mostrarIcono from "../assets/images/mostrar_contraseña.png";
import ocultarIcono from "../assets/images/ocultar_contraseña.png";
import Swal from "sweetalert2";
import useGlobalUIHandlers from "../scripts/useGlobalUIHandlers";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  useGlobalUIHandlers();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
      const res = await fetch('${import.meta.env.VITE_API_URL}/api/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        localStorage.setItem("username", username);
        Swal.fire("¡Bienvenido!", "Has iniciado sesión exitosamente.", "success");
        navigate("/");
      } else {
        Swal.fire("Error", "Usuario o contraseña incorrectos", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Hubo un problema con el servidor", "error");
    }
  };

  const togglePassword = (id) => {
      const input = document.getElementById(id);
      const icon = document.getElementById(`toggle-${id}`);
      if (input && icon) {
        if (input.type === "password") {
          input.type = "text";
          icon.src = ocultarIcono;
        } else {
          input.type = "password";
          icon.src = mostrarIcono;
        }
      }
  };

  return (
    <>
      <Header />
      <div className="boton-admin">
        <Link to="/loginAdmin" className="btn-admin">Admin</Link>
      </div>
      <div className="login-contenedor">
        <img src={robotImg} alt="Robot Ansiedad" className="login-img" />
        <div className="formularioDeIngreso">
          <div className="login-icon">
            <img src={userIcon} alt="Icono de usuario" />
          </div>
          <h2 className="tituloLogin">Iniciar Sesión</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <div className="input-con-icono">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Ingresa tu contraseña"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img src={mostrarIcono} id="toggle-password" alt="Mostrar" className="icono-pass" onClick={() => togglePassword("password")} />
            </div>

            <div className="cajaRecuerda">
              <input type="checkbox" id="recordar" />
              <label htmlFor="recordar">Recordármelo</label>
              <a href="#" className="forgot">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit">Ingresar</button>
          </form>

          <p className="registrarse">
            ¿Primera vez? Regístrate aquí <Link to="/registro">Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
