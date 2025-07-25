import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/adminEstadisticas.css";
import Chart from "chart.js/auto";

const AdminEstadisticas = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Refs para canvas DOM
  const canvasRefs = {
    genero: useRef(null),
    edad: useRef(null),
    facultad: useRef(null),
    escuela: useRef(null),
    ciclo: useRef(null),
    anioEstudio: useRef(null),
  };

  // Guardar instancias Chart separadas (no refs React)
  const chartInstances = useRef({});

  useEffect(() => {
    fetch("${import.meta.env.VITE_API_URL}/api/usuarios/todos")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener usuarios");
        return res.json();
      })
      .then((data) => {
        setUsuarios(data.usuarios || []);
        setLoading(false);
        setTimeout(() => {
          crearGraficos(data.usuarios || []);
        }, 100);
      })
      .catch((error) => {
        console.error("Error cargando estadísticas:", error);
        setLoading(false);
      });
  }, []);

  const destruirGraficoSiExiste = (key) => {
    if (chartInstances.current[key]) {
      chartInstances.current[key].destroy();
      delete chartInstances.current[key];
    }
  };

  const crearGraficos = (usuarios) => {
    const contarPorCampo = (campo) => {
      return usuarios.reduce((acc, usuario) => {
        const valor = usuario[campo] || "Desconocido";
        acc[valor] = (acc[valor] || 0) + 1;
        return acc;
      }, {});
    };

    const crearGraficoBarra = (key, titulo, datos) => {
      destruirGraficoSiExiste(key);
      const ctx = canvasRefs[key].current?.getContext("2d");
      if (!ctx) return;

      chartInstances.current[key] = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(datos),
          datasets: [
            {
              label: titulo,
              data: Object.values(datos),
              backgroundColor: "#0c1c36",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: titulo,
              font: { size: 16, weight: "bold" },
            },
          },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } },
          },
        },
      });
    };

    const crearGraficoCircular = (key, titulo, datos) => {
      destruirGraficoSiExiste(key);
      const ctx = canvasRefs[key].current?.getContext("2d");
      if (!ctx) return;

      const colores = [
        "#0c1c36",
        "#5a7fcf",
        "#9db8ff",
        "#143a89",
        "#1f4ecc",
        "#82a0ff",
        "#cad9ff",
      ];

      chartInstances.current[key] = new Chart(ctx, {
        type: "pie",
        data: {
          labels: Object.keys(datos),
          datasets: [
            {
              label: titulo,
              data: Object.values(datos),
              backgroundColor: colores,
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "right" },
            title: {
              display: true,
              text: titulo,
              font: { size: 16, weight: "bold" },
            },
          },
        },
      });
    };

    crearGraficoCircular("genero", "Usuarios por Género", contarPorCampo("genero"));
    crearGraficoBarra("edad", "Usuarios por Edad", contarPorEdad(usuarios));
    crearGraficoBarra("facultad", "Usuarios por Facultad", contarPorCampo("facultad"));
    crearGraficoBarra("escuela", "Usuarios por Escuela", contarPorCampo("escuela"));
    crearGraficoBarra("ciclo", "Usuarios por Ciclo", contarPorCampo("ciclo"));
    crearGraficoBarra("anioEstudio", "Usuarios por Año de Estudio", contarPorCampo("anio_estudio"));
  };

  const contarPorEdad = (usuarios) => {
    const conteo = {};
    usuarios.forEach((u) => {
      const edad = u.edad || "Desconocida";
      conteo[edad] = (conteo[edad] || 0) + 1;
    });
    const clavesOrdenadas = Object.keys(conteo).sort((a, b) => parseInt(a) - parseInt(b));
    const conteoOrdenado = {};
    clavesOrdenadas.forEach((k) => (conteoOrdenado[k] = conteo[k]));
    return conteoOrdenado;
  };

  if (loading) return <p>Cargando estadísticas...</p>;

  return (
    <main className="admin-contenedor">
      <button
        className="boton-cerrar-sesion"
        onClick={() => {
          navigate("/loginadmin");
        }}
      >
        Cerrar sesión
      </button>

      <h1>Resumen Estadístico de Usuarios</h1>

      <div className="graficos">
        <div className="grafico">
          <canvas id="graficoGenero" ref={canvasRefs.genero}></canvas>
        </div>
        <div className="grafico">
          <canvas id="graficoEdad" ref={canvasRefs.edad}></canvas>
        </div>
        <div className="grafico">
          <canvas id="graficoFacultad" ref={canvasRefs.facultad}></canvas>
        </div>
        <div className="grafico">
          <canvas id="graficoEscuela" ref={canvasRefs.escuela}></canvas>
        </div>
        <div className="grafico">
          <canvas id="graficoCiclo" ref={canvasRefs.ciclo}></canvas>
        </div>
        <div className="grafico">
          <canvas id="graficoAnioEstudio" ref={canvasRefs.anioEstudio}></canvas>
        </div>
      </div>
    </main>
  );
};

export default AdminEstadisticas;
