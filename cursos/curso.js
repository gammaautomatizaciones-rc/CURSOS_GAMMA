// =============================
// Verificar sesión
// =============================
const usuario = JSON.parse(localStorage.getItem("usuario"));
if (!usuario) {
  // Si no hay sesión → redirigimos al login
  window.location.href = "../auth/login.html";
}

// Si el usuario existe, definimos su rol
let esAdmin = usuario.rol === "admin";
let completados = 0;

// Mostrar saludo en la página
document.getElementById("bienvenida")?.innerText = `Bienvenido/a, ${usuario.nombre}`;

// Botón logout
document.getElementById("btn-logout")?.addEventListener("click", () => {
  localStorage.removeItem("usuario");
  window.location.href = "../auth/login.html";
});

// =============================
// Base de datos de cursos
// =============================
const cursos = {
  excel: {
    titulo: "Curso Intensivo de Excel",
    descripcion: "Un curso de 3 meses (12 clases) para dominar Excel desde cero hasta nivel avanzado.",
    modulos: [
      { titulo: "Módulo 1: Introducción a Excel", archivo: "../materiales/excel/modulo1.pdf" },
      { titulo: "Módulo 2: Formato de celdas", archivo: "../materiales/excel/modulo2.pdf" },
      { titulo: "Módulo 3: Funciones intermedias", archivo: "../materiales/excel/modulo3.pdf" },
      { titulo: "Módulo 4: Tablas dinámicas básicas", archivo: "../materiales/excel/modulo4.pdf" },
      { titulo: "Módulo 5: Gráficos y visualización", archivo: "../materiales/excel/modulo5.pdf" },
      { titulo: "Módulo 6: Funciones avanzadas", archivo: "../materiales/excel/modulo6.pdf" },
      { titulo: "Módulo 7: Fórmulas anidadas", archivo: "../materiales/excel/modulo7.pdf" },
      { titulo: "Módulo 8: Macros básicas", archivo: "../materiales/excel/modulo8.pdf" },
      { titulo: "Módulo 9: Análisis de datos", archivo: "../materiales/excel/modulo9.pdf" },
      { titulo: "Módulo 10: Dashboards simples", archivo: "../materiales/excel/modulo10.pdf" },
      { titulo: "Módulo 11: Integración con otros programas", archivo: "../materiales/excel/modulo11.pdf" },
      { titulo: "Módulo 12: Proyecto final", archivo: "../materiales/excel/modulo12.pdf" }
    ]
  },
  make: {
    titulo: "Curso de Automatización con Make",
    descripcion: "Un curso de 3 meses (12 clases) para aprender a automatizar procesos de negocio con Make.",
    modulos: [
      { titulo: "Módulo 1: Introducción a Make", archivo: "../materiales/make/modulo1.pdf" },
      { titulo: "Módulo 2: Creación de escenarios básicos", archivo: "../materiales/make/modulo2.pdf" },
      { titulo: "Módulo 3: Conexión con Google Sheets", archivo: "../materiales/make/modulo3.pdf" },
      { titulo: "Módulo 4: Envío de emails automáticos", archivo: "../materiales/make/modulo4.pdf" },
      { titulo: "Módulo 5: Webhooks y capturas de datos", archivo: "../materiales/make/modulo5.pdf" },
      { titulo: "Módulo 6: Filtrados y Ruteos", archivo: "../materiales/make/modulo6.pdf" },
      { titulo: "Módulo 7: Manejo de errores y logs", archivo: "../materiales/make/modulo7.pdf" },
      { titulo: "Módulo 8: APIs externas y JSON", archivo: "../materiales/make/modulo8.pdf" },
      { titulo: "Módulo 9: Automatización con CRMs", archivo: "../materiales/make/modulo9.pdf" },
      { titulo: "Módulo 10: Optimización de escenarios", archivo: "../materiales/make/modulo10.pdf" },
      { titulo: "Módulo 11: Integraciones avanzadas", archivo: "../materiales/make/modulo11.pdf" },
      { titulo: "Módulo 12: Proyecto final", archivo: "../materiales/make/modulo12.pdf" }
    ]
  }
};

// =============================
// Configuración
// =============================
const params = new URLSearchParams(window.location.search);
const idCurso = params.get("id");

// =============================
// Render principal
// =============================
function renderModulos() {
  if (!(idCurso && cursos[idCurso])) return;

  completados = 0;
  const curso = cursos[idCurso];

  document.getElementById("titulo-curso").innerText = curso.titulo;
  document.getElementById("descripcion-curso").innerText = curso.descripcion;

  const lista = document.getElementById("lista-modulos");
  lista.innerHTML = "";

  curso.modulos.forEach((mod, i) => {
    const keyHabilitado = `${idCurso}-modulo-${i}-habilitado`;
    const keyCompletado = `${idCurso}-modulo-${i}-completado`;

    const habilitado = localStorage.getItem(keyHabilitado) === "true";
    const completado = localStorage.getItem(keyCompletado) === "true";

    const moduloDiv = document.createElement("div");
    moduloDiv.classList.add("modulo");
    if (!habilitado) moduloDiv.classList.add("locked");

    moduloDiv.innerHTML = `
      <div class="modulo-header">
        <h3>${mod.titulo}</h3>
        <span class="status">${habilitado ? "✅ Disponible" : "🔒 Bloqueado"}</span>
      </div>
      <div class="modulo-content">
        ${habilitado ? `<a href="${mod.archivo}" download class="btn">📥 Descargar PDF</a>` : ""}
        ${habilitado ? `<button class="completar-btn">${completado ? "✔ Completado" : "Marcar como completado"}</button>` : ""}
        ${!habilitado && esAdmin ? `<button class="habilitar-btn">🔑 Habilitar módulo</button>` : ""}
      </div>
    `;

    // Toggle abrir/cerrar
    moduloDiv.querySelector(".modulo-header").addEventListener("click", () => {
      if (habilitado) moduloDiv.classList.toggle("active");
    });

    // Botón habilitar (solo admin)
    if (!habilitado && esAdmin) {
      moduloDiv.querySelector(".habilitar-btn").addEventListener("click", () => {
        localStorage.setItem(keyHabilitado, "true");
        renderModulos();
      });
    }

    // Botón completar
    if (habilitado) {
      const btn = moduloDiv.querySelector(".completar-btn");
      if (completado) {
        btn.classList.add("completado");
      }
      btn.addEventListener("click", () => {
        localStorage.setItem(keyCompletado, "true");
        renderModulos();
      });
    }

    if (habilitado && completado) completados++;
    lista.appendChild(moduloDiv);
  });

  actualizarProgreso(curso.modulos.length);
}

// =============================
// Barra de progreso
// =============================
function actualizarProgreso(total) {
  const porcentaje = Math.round((completados / total) * 100);
  document.getElementById("barra-progreso").style.width = `${porcentaje}%`;
  document.getElementById("texto-progreso").innerText = `${completados} de ${total} módulos completados`;
}

// =============================
// Inicializar
// =============================
document.addEventListener("DOMContentLoaded", () => {
  renderModulos();
});
