import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import "../assets/styles/preguntas.css";
import "../assets/styles/header.css";
import Header from "../components/Header";

import {
  guardarRespuesta,
  validarRespuestaActual,
  enviarRespuestas
} from "../scripts/preguntasUTILs";

const imagenBase = "/emojis/"; // Suponiendo que tus imágenes están en public/imagenes/

const Pregunta = () => {
  const { numero } = useParams();
  const navigate = useNavigate();
  const numeroInt = parseInt(numero);
  const [pregunta, setPregunta] = useState("");
  const [seleccion, setSeleccion] = useState(null);
  const [emoji, setEmoji] = useState("cara1.png");
  const [anterior, setAnterior] = useState(null);
  const [siguiente, setSiguiente] = useState(null);
  const [fijado, setFijado] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/test/pregunta/${numero}`)
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar la pregunta");
        return res.json();
      })
      .then(data => {
        setPregunta(data.pregunta);
        setAnterior(data.anterior);
        setSiguiente(data.siguiente);

        // Cargar respuesta previa si existe
        const respuestas = JSON.parse(sessionStorage.getItem("respuestas") || "{}");
        if (respuestas[numero]) {
          setSeleccion(respuestas[numero]);
          setEmoji(`cara${respuestas[numero] + 1}.png`);
          setFijado(true);
        } else {
          setSeleccion(null);
          setEmoji("cara1.png");
          setFijado(false);
        }
      })
      .catch(() => {
        Swal.fire("Error", "No se pudo cargar la pregunta.", "error");
      });
  }, [numero]);

  const manejarEnviar = async () => {
    const ok = await enviarRespuestas();
    if (!ok) {
      // Puedes hacer algo aquí si quieres, pero la función ya muestra alertas
      return;
    }
    navigate("/");
  };

  const manejarSeleccion = (index) => {
    setSeleccion(index);
    setEmoji(`cara${index + 1}.png`);
    setFijado(true);
    guardarRespuesta(numero, index);
  };

  // Validar y avanzar
  const handleValidarYAvanzar = () => {
    if (!validarRespuestaActual(numero)) {
      Swal.fire({
        icon: "warning",
        title: "Debes responder la pregunta antes de continuar.",
        confirmButtonText: "Entendido"
      });
      return;
    }
    navigate(`/test/pregunta/${siguiente}`);
  };

  const manejarVolverInicio = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Si vuelves al inicio, podrías perder tu progreso.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, volver al inicio",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/");
      }
    });
  };

  return (
    <>
      <Header />

      <main>
        <h1 id="numero-pregunta" data-numero={numero}>
          PREGUNTA {numero}
        </h1>
        <div className="pregunta">
          <div className="enunciado">{pregunta}</div>
          <div className="respuesta">
            <div className="emoji" id="emoji-preview">
              <img id="emoji-img" src={`${imagenBase}${emoji}`} alt="Emoji" />
            </div>
            <div className="opciones">
              {["NUNCA", "CASI NUNCA", "A VECES", "CASI SIEMPRE"].map((texto, index) => (
                <div
                  key={index}
                  className={`opcion ${seleccion === index ? "seleccionada" : ""}`}
                  onMouseOver={() => !fijado && setEmoji(`cara${index + 1}.png`)}
                  onMouseOut={() => !fijado && setEmoji("cara1.png")}
                  onClick={() => manejarSeleccion(index)}
                >
                  {texto}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="acciones">
          {numeroInt > 1 ? (
            <button className="btn" onClick={() => navigate(`/test/pregunta/${anterior}`)}>
              ◀ REGRESAR
            </button>
          ) : (
            <button className="btn" onClick={manejarVolverInicio}>
              ⬅ VOLVER AL INICIO
            </button>
          )}

          {numeroInt === 21 ? (
            <button className="btn siguiente" onClick={manejarEnviar}>
              ENVIAR
            </button>
          ) : (
            <button className="btn siguiente" onClick={handleValidarYAvanzar}>
              SIGUIENTE ➤
            </button>
          )}
        </div>
      </main>
    </>
  );
};
export default Pregunta;
