// src/pages/Resultado.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../assets/styles/resultado.css';

const Resultado = () => {
  const [resultado, setResultado] = useState('');
  const [recomendacion, setRecomendacion] = useState('');
  const [total, setTotal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = sessionStorage.getItem("resultado");
    if (data) {
      const parsed = JSON.parse(data);
      setResultado(parsed.resultado);
      setRecomendacion(parsed.recomendacion);
      setTotal(parsed.total);
    } else {
      navigate("/test"); // si no hay datos, redirige al test
    }
  }, []);

  return (
    <>
      <Header />
      <main>
        <h1>Resultado del Test de Ansiedad</h1>
        <p>Según tus respuestas, tu nivel de ansiedad es:</p>
        <h2 className="nivel">{resultado}</h2>
        {total !== null && <p>Puntaje total: {total}</p>}

        <p className="recomendacion">{recomendacion}</p>

        <a href="/" className="btn">Volver al inicio</a>
      </main>
    </>
  );
};

export default Resultado;

