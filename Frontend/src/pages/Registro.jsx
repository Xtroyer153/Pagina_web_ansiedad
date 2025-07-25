// src/pages/Registro.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../assets/styles/registro.css";
import robotImg from "../assets/images/r1.png";
import mostrarIcono from "../assets/images/mostrar_contraseña.png";
import ocultarIcono from "../assets/images/ocultar_contraseña.png";
import useRegistroForm from "../scripts/useRegistroForm";
import Swal from "sweetalert2";
import useGlobalUIHandlers from "../scripts/useGlobalUIHandlers";

function Registro() {
  const navigate = useNavigate();
  useGlobalUIHandlers();

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmar_password: "",
    codigo_estudiantil: "",
    correo_institucional: "",
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
    facultad: "",
    escuela: "",
    anio_estudio: "",
    edad: "",
    genero: "",
    ciclo: "",
    terminos: false,
    escuelasDisponibles: [],
  });

  useRegistroForm(setForm, form);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : (name === "anio_estudio" || name === "edad")
            ? parseInt(value) || ""
            : value,
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.password || !form.confirmar_password) {
      const data = await res.json();
      Swal.fire("Error", data.detail || "No se pudo registrar el usuario", "error");
    }
    if (form.password !== form.confirmar_password) {
      Swal.fire("Error", "Las contraseñas no coinciden", "error");
      return;
    }

    const payload = { ...form };
    delete payload.terminos;
    delete payload.confirmar_password;
    delete payload.escuelasDisponibles;
    delete payload.correo_institucional;

    try {
      const res = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        Swal.fire("¡Éxito!", "Usuario registrado correctamente", "success");
        navigate("/login");
      } else {
        const data = await res.json();
        Swal.fire("Error", data.detail || "No se pudo registrar el usuario", "error");
      }

    } catch (err) {
      Swal.fire("Error", "Error del servidor", "error");
    }
  };

  return (
    <>
      <Header />
      <div className="registro-container">
        <img src={robotImg} alt="Robot Registro" className="robot-img" />
        <div className="form-box">
          <h2 className="tituloRegis">Ayudanos a Registrarte</h2>
          <form onSubmit={handleSubmit} id="registro-form">
            <div className="form-row">
              <input type="email" name="email" placeholder="Correo electrónico" required onChange={handleChange} />
            </div>

            <div className="form-row">
              <input type="text" name="username" placeholder="Username" required onChange={handleChange} />
              <div className="input-con-icono">
                <input type="password" name="password" id="password" placeholder="Contraseña" required onChange={handleChange} />
                <img src={mostrarIcono} id="toggle-password" alt="Mostrar" className="icono-pass" onClick={() => togglePassword("password")} />
              </div>
            </div>

            <div className="form-row">
              <div className="input-con-icono">
                <input type="password" name="confirmar_password" id="confirmar_password" placeholder="Confirmar contraseña" required onChange={handleChange} />
                <img src={mostrarIcono} id="toggle-confirmar_password" alt="Mostrar" className="icono-pass" onClick={() => togglePassword("confirmar_password")} />
              </div>
            </div>

            <div className="form-row">
              <input type="text" name="codigo_estudiantil" id="codigo_estudiantil" placeholder="Código estudiantil" maxLength="10" required onChange={handleChange} />
              <input type="text" id="correo_institucional" value={form.correo_institucional} placeholder="Correo institucional" disabled />
            </div>

            <div className="form-row">
              <input type="text" name="nombres" placeholder="Nombres Completos" required onChange={handleChange} />
            </div>

            <div className="form-row">
              <input type="text" name="apellido_paterno" placeholder="Apellido Paterno" required onChange={handleChange} />
              <input type="text" name="apellido_materno" placeholder="Apellido Materno" required onChange={handleChange} />
            </div>

            <div className="form-row">
              <select name="facultad" required onChange={handleChange}>
                <option value="" disabled>Facultad</option>
                <option>Psicología</option>
                <option>Administración</option>
                <option>Ingeniería Industrial y de Sistemas</option>
                <option>Ingeniería Geográfica, Ambiental y Ecoturismo</option>
              </select>
            </div>

            <div className="form-row">
              <select name="escuela" required disabled={!form.escuelasDisponibles.length} onChange={handleChange}>
                <option value="" disabled>Escuela profesional</option>
                {form.escuelasDisponibles.map((escuela) => (
                  <option key={escuela}>{escuela}</option>
                ))}
              </select>

              <select name="anio_estudio" required onChange={handleChange}>
                <option value="" disabled>Año de estudio</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <input type="number" name="edad" placeholder="Edad" min="1" required onChange={handleChange} />
              <select name="genero" required onChange={handleChange}>
                <option value="" disabled>Género</option>
                <option>Femenino</option>
                <option>Masculino</option>
                <option>Otro</option>
              </select>
              <select name="ciclo" required onChange={handleChange}>
                <option value="" disabled>Ciclo</option>
                {["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-row checkbox-row">
              <label>
                <input type="checkbox" name="terminos" required onChange={handleChange} />
                Acepto los Términos y Condiciones
              </label>
            </div>

            <div className="form-row">
              <button type="submit">Crear cuenta</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Registro;