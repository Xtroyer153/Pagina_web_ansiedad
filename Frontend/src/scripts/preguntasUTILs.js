// src/scripts/preguntas.js
import Swal from "sweetalert2";

export function validarYAvanzar(siguienteUrl) {
  const h1 = document.getElementById("numero-pregunta");
  const numeroPregunta = parseInt(h1.dataset.numero);

  const respuestas = JSON.parse(sessionStorage.getItem("respuestas") || "{}");

  if (!respuestas.hasOwnProperty(numeroPregunta.toString())) {
    Swal.fire({
      icon: "warning",
      title: "Debes responder la pregunta antes de continuar.",
      confirmButtonText: "Entendido"
    });
    return;
  }

  window.location.href = siguienteUrl;
}

export async function enviarRespuestas() {
  const respuestasDict = JSON.parse(sessionStorage.getItem("respuestas") || "{}");
  const respuestasLista = [];

  for (let i = 1; i <= 21; i++) {
    const key = i.toString();
    if (!respuestasDict.hasOwnProperty(key)) {
      window.Swal.fire({
        icon: "warning",
        title: `Te falta responder la pregunta ${i}.`,
        confirmButtonText: "OK"
      });
      return false;
    }
    respuestasLista.push(respuestasDict[key]);
  }

  try {
    const res = await fetch("http://localhost:8000/api/test/resultado", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ respuestas: respuestasLista }),
    });

    const data = await res.json();

    if (data.status === "ok") {
      // Guardar los resultados en sessionStorage
      sessionStorage.setItem("resultado", JSON.stringify(data));
      sessionStorage.removeItem("respuestas");

      // Redirigir a /resultados (componente React)
      window.location.href = "/resultado";
      return true;
    } else {
      throw new Error("Respuesta del servidor no válida");
    }
  } catch (error) {
    window.Swal.fire({
      icon: "error",
      title: "Error enviando respuestas",
      text: error.message,
    });
    return false;
  }
}


export function guardarRespuesta(numeroPregunta, index) {
  const respuestas = JSON.parse(sessionStorage.getItem("respuestas") || "{}");
  respuestas[numeroPregunta.toString()] = index;
  sessionStorage.setItem("respuestas", JSON.stringify(respuestas));
}

export function validarRespuestaActual(numeroPregunta) {
  const respuestas = JSON.parse(sessionStorage.getItem("respuestas") || "{}");
  return respuestas.hasOwnProperty(numeroPregunta.toString());
}

export function obtenerRespuestas() {
  return JSON.parse(sessionStorage.getItem("respuestas") || "{}");
}
