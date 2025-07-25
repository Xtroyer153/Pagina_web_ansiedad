import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import LoginAdmin from "./pages/LoginAdmin";
import Registro from "./pages/Registro";
import Perfil from "./pages/Perfil";
import Test from "./pages/Test";
import Pregunta from "./pages/Preguntas";
import Consejo from "./pages/Consejo";
import Info from "./pages/Info";
import Nosotros from "./pages/Nosotros";
import Mision from "./pages/Mision";
import Confianza from "./pages/Confianza";
import Evaluarla from "./pages/Evaluarla";
import BAI from "./pages/BAI";
import Detalles from "./pages/Detalles";
import Historial from "./pages/Historial";
import Progreso from "./pages/Progreso";
import Resultado from "./pages/Resultado";
import Servicio from "./pages/Servicio";
import AdminEstadisticas from "./pages/AdminEstadisticas";


function AppContent() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const location = useLocation();
  const rutaActual = location.pathname;

  useEffect(() => {
    // No hacer fetch a /api/usuario/actual en login y registro
    if (rutaActual === "/login" || rutaActual === "/registro") {
      setCargando(false);
      return;
    }

    fetch("/api/usuario/actual", {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("No autenticado");
        return res.json();
      })
      .then((data) => {
        if (data?.usuario) setUsuario(data.usuario);
      })
      .catch(() => {
        setUsuario(null);
      })
      .finally(() => {
        setCargando(false);
      });
  }, [rutaActual]);

  if (cargando) {
    return (
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        flexDirection: "column", height: "100vh", background: "#f8f8f8"
      }}>
        <h2>Cargando...</h2>
        <p>Verificando sesión del usuario</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home usuario={usuario} />} />
      <Route path="/login" element={<Login setUsuario={setUsuario} />} />
      <Route path="/loginAdmin" element={<LoginAdmin setUsuario={setUsuario} />} />
      <Route path="/registro" element={<Registro />} />
      <Route
        path="/perfil"
        element={usuario ? <Perfil usuario={usuario} /> : <Navigate to="/login" />}
      />
      <Route
        path="/test"
        element={usuario ? <Test /> : <Navigate to="/login?msg=login_required" />}
      />
      <Route
        path="/test/pregunta/:numero"
        element={usuario ? <Pregunta /> : <Navigate to="/login?msg=login_required" />}
      />
      <Route path="/consejo" element={<Consejo />} />
      <Route path="Info" element={<Info />} />
      <Route path="/Nosotros" element={<Nosotros />} />
      <Route path="/Mision" element={<Mision />} />
      <Route path="/Confianza" element={<Confianza/>} />
      <Route path="/Evaluarla" element={<Evaluarla/>} />
      <Route path="/BAI" element={<BAI/>} />
      <Route path="/detalle/:id" element={<Detalles />} />
      <Route path="/historial" element={<Historial />} />
      <Route path="/progreso" element={<Progreso />} />
      <Route path="/resultado" element={<Resultado />} />
      <Route path="/Servicio" element={<Servicio />} />
      <Route path="/AdminEstadisticas" element={<AdminEstadisticas />} />
      <Route path="*" element={
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h1>404 - Página no encontrada</h1>
          <p>La página que buscas no existe</p>
        </div>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
