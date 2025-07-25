// src/pages/Detalles.jsx

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Header from '../components/Header';
import '../assets/styles/detalles.css';

const opciones = ['NUNCA', 'CASI NUNCA', 'A VECES', 'CASI SIEMPRE'];

const Detalles = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resultado, setResultado] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const chartRef = useRef();

  useEffect(() => {
    fetch(`/api/detalle/${id}`)
      .then(res => {
        if (res.status === 401) navigate("/login");
        return res.json();
      })
      .then(data => {
        setResultado(data.resultado);
        setRespuestas(data.respuestas);
        renderChart(data.respuestas);
      })
      .catch(err => console.error(err));
  }, [id]);

  const renderChart = (respuestas) => {
    const ctx = document.getElementById('graficoRespuestas');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: respuestas.map((_, i) => `P${i + 1}`),
        datasets: [
          {
            label: 'Puntaje por pregunta',
            data: respuestas,
            backgroundColor: '#6a99ec',
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  };

const descargarPDF = async () => {
  const elemento = document.getElementById("detalle-container");

  // Oculta botones antes de capturar
  const botones = document.querySelector(".botones-acciones");
  botones.style.display = "none";

  // Espera a que el DOM actualice visualmente
  await new Promise(resolve => setTimeout(resolve, 300));

  const canvas = await html2canvas(elemento, {
    scale: 2,
    useCORS: true
  });

  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let position = 0;

  while (position < imgHeight) {
    const pageCanvas = document.createElement("canvas");
    const pageCtx = pageCanvas.getContext("2d");

    const pageHeightPx = (canvas.width * pageHeight) / pageWidth;

    pageCanvas.width = canvas.width;
    pageCanvas.height = pageHeightPx;

    pageCtx.drawImage(
      canvas,
      0,
      (position * canvas.width) / imgWidth,
      canvas.width,
      pageHeightPx,
      0,
      0,
      canvas.width,
      pageHeightPx
    );

    const pageData = pageCanvas.toDataURL("image/png");
    if (position !== 0) pdf.addPage();
    pdf.addImage(pageData, "PNG", 0, 0, imgWidth, pageHeight);

    position += pageHeight;
  }

  // Restaura botones
  botones.style.display = "flex";

  pdf.save("resultado_test.pdf");
};



  if (!resultado) return <p>Cargando...</p>;

  return (
    <>
      <Header />
      <main>
        <section className="detalle-container" id="detalle-container">
          <h1>Detalles del Resultado del Test</h1>

          <div className="resultado-resumen">
            <div className="card-item"><span className="etiqueta">Resultado:</span> {resultado.resultado}</div>
            <div className="card-item"><span className="etiqueta">Fecha:</span> {resultado.fecha}</div>
            <div className="card-item"><span className="etiqueta">Hora:</span> {resultado.hora}</div>
            <div className="card-item"><span className="etiqueta">Total de Puntos:</span> {resultado.total}</div>
          </div>

          <h2>Respuestas Individuales</h2>
          <div className="tabla-respuestas">
            <table>
              <thead>
                <tr>
                  <th>N° Pregunta</th>
                  <th>Opción Seleccionada</th>
                  <th>Puntaje</th>
                </tr>
              </thead>
              <tbody>
                {respuestas.map((val, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{opciones[val]}</td>
                    <td>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Visualización Gráfica</h2>
          <canvas id="graficoRespuestas" width="600" height="300" ref={chartRef}></canvas>

          <div className="botones-acciones">
            <button className="btn-volver" onClick={() => navigate("/historial")}>← Volver al Historial</button>
            <button className="btn-volver derecha" onClick={descargarPDF}>Descargar en PDF 📄</button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Detalles;
