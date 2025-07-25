// src/scripts/useGlobalUIHandlers.js
import { useEffect } from "react";
import Swal from "sweetalert2";

function useGlobalUIHandlers() {
  useEffect(() => {
    // Función para manejar menús desplegables
    window.togglePanel = function (id) {
      document.querySelectorAll(".dropdown-content").forEach((panel) => {
        if (panel.id === id) {
          panel.classList.toggle("show");
        } else {
          panel.classList.remove("show");
        }
      });
    };

    // Cierra los dropdowns si se hace clic fuera
    const handleClickOutside = (event) => {
      if (
        !event.target.matches(".dropbtn") &&
        !event.target.closest(".user-dropbtn")
      ) {
        document.querySelectorAll(".dropdown-content").forEach((panel) => {
          panel.classList.remove("show");
        });

        const perfilBtn = document.getElementById("perfilBtn");
        perfilBtn?.classList.remove("open");
      }
    };

    document.addEventListener("click", handleClickOutside);

    // Manejo de mensajes con SweetAlert (en URL params)
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get("msg");

    if (msg === "login_ok") {
      Swal.fire("¡Bienvenido!", "Has iniciado sesión exitosamente.", "success");
    } else if (msg === "login_error") {
      Swal.fire("Error", "Usuario o contraseña incorrectos.", "error");
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
}

export default useGlobalUIHandlers;