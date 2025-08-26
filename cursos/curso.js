// =============================
// Verificar sesión
// =============================
const usuario = JSON.parse(localStorage.getItem("usuario"));
if (!usuario) {
  window.location.href = "../auth/login.html";
}

const esAdmin = usuario.rol === "admin";
let completados = 0;

// Mostrar saludo
document.getElementById("bienvenida")?.innerText = `Bienvenido/a, ${usuario.nombre} (Grupo ${usuario.grupo})`;

// Botón logout
document.getElementById("btn-logout")?.addEventListener("click", () => {
  localStorage.removeItem("usuario");
  window.location.href = "../auth/login.html";
});

// =============================
// Configuración
// =============================
const API_URL = "https://script.google.com/macros/s/AKfycby6UinPQK_fVubcyzyhRGEnz_oNsOiRanyIoYKNsSzt0GZiQuPL62n5f4OB8liT6EQ9/exec";

const cursos = {
  excel: {
    titulo: "Curso Intensivo de Excel",
    descripcion: "Un curso de 3 meses (12 clases) para dominar Excel desde cero hasta nivel avanzado.",
    modulos: Array.from({ length: 12 }, (_, i) => ({
      titulo: `Módulo ${i + 1}`,
      url: `modulos/excel/modulo${i + 1}.html`
    }))
  },
  make: {
    titulo: "Curso de Automatización con Make",
    descripcion: "Un curso de 3 meses (12 clases) para aprender a automatizar procesos de negocio con Make.",
    modulos: Array.from({ length: 12 }, (_, i) => ({
      titulo: `Módulo ${i + 1}`,
      url: `modulos/make/modulo${i + 1}.html`
    }))
  }
};

// =============================
// Helpers backend
// =============================
async function obtenerProgreso(curso, grupo) {
  try {
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: "getProgreso",
        curso,
        grupo
      })
    });
    return await resp.json();
  } catch (err) {
    console.error("Error al obtener progreso:", err);
    return { success: false, modulos: [] };
  }
}

async function habilitarModulo(curso, grupo, modulo) {
  try {
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: "habilitarModulo",
        curso,
        grupo,
        modulo
      })
    });
    return await resp.json();
  } catch (err) {
    console.error("Error al habilitar módulo:", err);
    return { success: false, msg: "⚠️ Error de conexión" };
  }
}

// =============================
// Render principal
// =============================
const params = new URLSearchParams(window.location.search);
const idCurso = params.get("id");

async function renderModulos() {
  if (!(idCurso && cursos[idCurso])) return;

  completados = 0;
  const curso = cursos[idCurso];

  document.getElementById("titulo-curso").innerText = curso.titulo;
  document.getElementById("descripcion-curso").innerText = curso.descripcion;

  const lista = document.getElementById("lista-modulos");
  lista.innerHTML = "";

  // Traer info de backend según curso y grupo del usuario
  const backendData = await obtenerProgreso(idCurso, usuario.grupo);
  const habilitados = backendData.success ? backendData.modulos : [];

  curso.modulos.forEach((mod, i) => {
    const habilitado = habilitados.find(m => m.modulo == i + 1)?.habilitado || false;
    const completado = localStorage.getItem(`${idCurso}-grupo-${usuario.grupo}-modulo-${i + 1}`) === "true";

    const moduloDiv = document.createElement("div");
    moduloDiv.classList.add("modulo");
    if (!habilitado) moduloDiv.classList.add("locked");

    moduloDiv.innerHTML = `
      <div class="modulo-header">
        <h3>${mod.titulo}</h3>
        <span class="status">${habilitado ? "✅ Disponible" : "🔒 Bloqueado"}</span>
      </div>
      <div class="modulo-content">
        ${habilitado ? `<a href="${mod.url}" class="btn">👉 Ir al módulo</a>` : ""}
        ${habilitado ? `<button class="completar-btn ${completado ? "completado" : ""}">${completado ? "✔ Completado" : "Marcar como completado"}</button>` : ""}
        ${!habilitado && esAdmin ? `<button class="habilitar-btn">🔑 Habilitar módulo</button>` : ""}
      </div>
    `;

    // Toggle abrir/cerrar
    moduloDiv.querySelector(".modulo-header").addEventListener("click", () => {
      if (habilitado) moduloDiv.classList.toggle("active");
    });

    // Botón habilitar (solo admin)
    if (!habilitado && esAdmin) {
      moduloDiv.querySelector(".habilitar-btn").addEventListener("click", async () => {
        await habilitarModulo(idCurso, usuario.grupo, i + 1);
        renderModulos();
      });
    }

    // Botón completar
    if (habilitado) {
      const btn = moduloDiv.querySelector(".completar-btn");
      btn.addEventListener("click", () => {
        localStorage.setItem(`${idCurso}-grupo-${usuario.grupo}-modulo-${i + 1}`, "true");
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


