import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../assets/styles/progreso.css';

const Progreso = () => {
  const [promedio, setPromedio] = useState('');
  const [fechas, setFechas] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [frecuencia, setFrecuencia] = useState({});
  const navigate = useNavigate();

  // REFERENCIAS A LOS CHARTS
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    fetch('${import.meta.env.VITE_API_URL}/api/usuario/actual')
      .then(res => {
        if (res.status === 401) {
          navigate('/login');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data?.usuario) {
          fetch(`${import.meta.env.VITE_API_URL}/api/progreso/${data.usuario}`)
            .then(res => res.json())
            .then(datos => {
              setPromedio(datos.promedio);
              setFechas(datos.fechas);
              setNiveles(datos.niveles);
              setFrecuencia(datos.frecuencia);
              renderLineChart(datos.fechas, datos.niveles);
              renderBarChart(datos.frecuencia);
            });
        }
      });

    // Cleanup: destruir charts si se desmonta
    return () => {
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
      }
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
    };
  }, [navigate]);

  const renderLineChart = (fechas, niveles) => {
    const ctx = document.getElementById("lineChart");
    if (!ctx) return;

    // Destruir gráfico anterior si existe
    if (lineChartRef.current) {
      lineChartRef.current.destroy();
    }

    // Crear nuevo gráfico y guardarlo en la ref
    lineChartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: fechas,
        datasets: [{
          label: "Nivel de Ansiedad",
          data: niveles,
          fill: false,
          borderColor: '#007bff',
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            ticks: {
              callback: (val) => ["Mínimo", "Leve", "Moderado", "Severo"][val] || val
            },
            beginAtZero: true,
            max: 3
          }
        }
      }
    });
  };

  const renderBarChart = (frecuencia) => {
    const ctx = document.getElementById("barChart");
    if (!ctx) return;

    if (barChartRef.current) {
      barChartRef.current.destroy();
    }

    barChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(frecuencia),
        datasets: [{
          label: "Frecuencia",
          data: Object.values(frecuencia),
          backgroundColor: '#28a745'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  };

  return (
    <>
      <Header />
      <main className="contenedor">
        <h1>Mi Progreso</h1>

        <div className="resumen">
          <p>Promedio general de ansiedad: <strong>{promedio}</strong></p>
        </div>

        <div className="graficas">
          <div className="grafica">
            <h2>Evolución del nivel de ansiedad</h2>
            <canvas id="lineChart"></canvas>
          </div>

          <div className="grafica">
            <h2>Frecuencia de niveles de ansiedad</h2>
            <canvas id="barChart"></canvas>
          </div>
        </div>
      </main>
    </>
  );
};

export default Progreso;
