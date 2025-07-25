// src/pages/Perfil.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../assets/styles/perfil.css";
import robotPerfil from "../assets/images/robot_perfil.png";
import Swal from "sweetalert2";
import useGlobalUIHandlers from "../scripts/useGlobalUIHandlers";

function Perfil() {
  const [datos, setDatos] = useState(null);
  const navigate = useNavigate();
  useGlobalUIHandlers();

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await fetch("${import.meta.env.VITE_API_URL}/api/usuario/perfil");
        if (res.status === 401) {
          navigate("/login?msg=login_required");
          return;
        }
        const data = await res.json();
        console.log("Perfil recibido:", data.perfil); // opcional para debug
        setDatos({ ...data.perfil }); // ✅ CORREGIDO
      } catch (error) {
        console.error("Error al cargar el perfil", error);
        Swal.fire("Error", "No se pudo cargar tu perfil", "error");
      }
    };
    fetchPerfil();
  }, [navigate]);

  const handleLogout = async () => {
    const res = await fetch("${import.meta.env.VITE_API_URL}/api/logout", { method: "POST" });
    if (res.ok) {
      navigate("/login?msg=logout_success");
    } else {
      Swal.fire("Error", "No se pudo cerrar sesión", "error");
    }
  };

  const handleEliminarCuenta = async (e) => {
    e.preventDefault();
    const confirmado = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmado.isConfirmed) {
      const res = await fetch("/api/eliminar_usuario", {
        method: "POST",
      });
      if (res.ok) {
        Swal.fire("Cuenta eliminada", "Tu cuenta ha sido eliminada", "success");
        navigate("/");
      } else {
        Swal.fire("Error", "No se pudo eliminar la cuenta", "error");
      }
    }
  };

  if (!datos) return <div>Cargando perfil...</div>;

  return (
    <>
      <Header />
      <main className="perfil-main">
        <section className="perfil-info">
          <h2>
            {datos.nombres && datos.apellido_paterno
              ? `BIENVENIDO, ${datos.nombres.toUpperCase()} ${datos.apellido_paterno.toUpperCase()}`
              : "BIENVENIDO"}
          </h2>
          <h3>DATOS PERSONALES</h3>
          <div className="datos-grid">
            {[
              { label: "Nombres Completos", value: datos.nombres },
              { label: "Apellido Paterno", value: datos.apellido_paterno },
              { label: "Apellido Materno", value: datos.apellido_materno },
              { label: "Edad", value: datos.edad },
              { label: "Correo Electrónico", value: datos.email },
              { label: "Código Estudiantil", value: datos.codigo_estudiantil },
              { label: "Correo Institucional", value: datos.correo_institucional },
              { label: "Año de Estudio", value: datos.anio_estudio },
              { label: "Facultad", value: datos.facultad },
              { label: "Escuela Profesional", value: datos.escuela },
              { label: "Género", value: datos.genero },
              { label: "Ciclo", value: datos.ciclo },
            ].map((campo, i) => (
              <div className="campo" key={i}>
                <label>{campo.label}</label>
                <input type="text" value={campo.value || ""} disabled />
              </div>
            ))}
          </div>

          <div className="botones">
            <form onSubmit={handleEliminarCuenta}>
              <button type="submit" className="btn-eliminar-cuenta">
                Eliminar cuenta 🗑️
              </button>
            </form>
          </div>
        </section>

        <aside className="perfil-imagen">
          <img src={robotPerfil} alt="Robot" />
        </aside>
      </main>
    </>
  );
}

export default Perfil;
