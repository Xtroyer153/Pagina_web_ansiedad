// src/scripts/useRegistroForm.js
import { useEffect } from "react";

export default function useRegistroForm(setForm, form) {
  useEffect(() => {
    // Actualiza correo institucional automáticamente
    const codigo = form.codigo_estudiantil;
    if (/^\d{10}$/.test(codigo)) {
      setForm((prev) => ({
        ...prev,
        correo_institucional: `${codigo}@unfv.edu.pe`
      }));
    } else {
      setForm((prev) => ({ ...prev, correo_institucional: "" }));
    }
  }, [form.codigo_estudiantil, setForm]);

  useEffect(() => {
    const facultad = form.facultad;
    const escuelasPorFacultad = {
      Psicología: ["Psicología"],
      Administración: [
        "Administración de Empresas",
        "Administración de Turismo",
        "Administración Pública",
        "Marketing",
        "Negocios Internacionales",
      ],
      "Ingeniería Industrial y de Sistemas": [
        "Ingeniería Industrial",
        "Ingeniería de Sistemas",
        "Ingeniería de Transportes",
        "Ingeniería Agroindustrial",
      ],
      "Ingeniería Geográfica, Ambiental y Ecoturismo": [
        "Ingeniería Geográfica",
        "Ingeniería Ambiental",
        "Ingeniería de Ecoturismo",
      ],
    };

    if (facultad && escuelasPorFacultad[facultad]) {
      setForm((prev) => ({
        ...prev,
        escuelasDisponibles: escuelasPorFacultad[facultad],
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        escuelasDisponibles: [],
      }));
    }
  }, [form.facultad, setForm]);
}
