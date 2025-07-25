// src/pages/Historial.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../assets/styles/historial.css';

const Historial = () => {
  const [resultados, setResultados] = useState([]);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener usuario actual desde sesión
    fetch('/api/usuario/actual')
      .then(res => {
        if (res.status === 401) {
          navigate('/login');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data?.usuario) {
          setUsername(data.usuario);
          return fetch(`/api/historial/${data.usuario}`);
        }
      })
      .then(res => res?.json())
      .then(data => {
        if (data?.status === 'ok') {
          setResultados(data.resultados);
        }
      })
      .catch(err => {
        console.error("Error al obtener historial:", err);
      });
  }, [navigate]);

  return (
    <>
      <Header />
      <main>
        <h1>Mi historial</h1>
        {resultados.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Resultado</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Total de Puntos</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map(r => (
                <tr key={r.id}>
                  <td>{r.resultado}</td>
                  <td>{r.fecha}</td>
                  <td>{r.hora}</td>
                  <td>{r.total}</td>
                  <td>
                    <button
                      className="ver-mas-btn"
                      onClick={() => navigate(`/detalle/${r.id}`)}
                    >
                      Ver más
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aún no has completado ningún test.</p>
        )}
      </main>
    </>
  );
};

export default Historial;
