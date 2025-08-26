// =============================
// Verificar sesión
// =============================
const usuario = JSON.parse(localStorage.getItem("usuario"));
if (!usuario) {
  window.location.href = "../../auth/login.html";
}

const esAdmin = usuario.rol === "admin";
let completados = 0;

// Mostrar saludo
document.getElementById("bienvenida")?.innerText =
  `Bienvenido/a, ${usuario.nombre} (Grupo ${usuario.grupo})`;

// Botón logout
document.getElementById("btn-logout")?.addEventListener("click", () => {
  localStorage.removeItem("usuario");
  window.location.href = "../../auth/login.html";
});

// =============================
// Configuración
// =============================
const PROGRESO_API_URL = "https://script.google.com/macros/s/AKfycbzymX3hUsIA9oF7gK_hA5IOHXYqdxe_t2rh1UKXHzOIJpeVH1Wp6U8kZ9-lD9ijzEGjZQ/exec";

// Curso fijo: Excel
const cursos = {
  excel: {
    titulo: "Curso Intensivo de Excel",
    descripcion: "Un curso de 3 meses (12 clases) para dominar Excel desde cero hasta avanzado.",
    modulos: Array.from({ length: 12 }, (_, i) => ({
      titulo: `Módulo ${i + 1}`,
      url: `modulo${i + 1}.html`
    }))
  }
};

// =============================
// Helpers backend
// =============================
async function postBackend(data) {
  try {
    const resp = await fetch(PROGRESO_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data)
    });
    return await resp.json();
  } catch (err) {
    console.error("Error conexión backend:", err);
    return { success: false };
  }
}

async function obtenerProgreso(curso, grupo) {
  return await postBackend({ action: "getProgresoGrupo", curso, grupo });
}

async function habilitarModulo(curso, grupo, modulo) {
  return await postBackend({ action: "habilitarModulo", curso, grupo, modulo });
}

async function completarModulo(curso, grupo, modulo, email) {
  return await postBackend({ action: "completarModulo", curso, grupo, modulo, email });
}

// =============================
// Render principal
// =============================
async function renderModulos() {
  const idCurso = "excel"; // fijo
  const curso = cursos[idCurso];
  completados = 0;

  // Títulos
  document.getElementById("titulo-curso").innerText = curso.titulo;
  document.getElementById("descripcion-curso").innerText = curso.descripcion;

  const lista = document.getElementById("lista-modulos");
  lista.innerHTML = "";

  // Traer info de backend según curso y grupo
  const backendData = await obtenerProgreso(idCurso, usuario.grupo);
  const habilitados = backendData.success ? backendData.progreso || [] : [];

  // Mostrar solo módulos habilitados
  habilitados.forEach(registro => {
    const i = registro.modulo - 1;
    const mod = curso.modulos[i];
    const habilitado = registro.habilitado === true || registro.habilitado === "TRUE";

    if (!habilitado) return; // si no está habilitado, no lo mostramos

    const completadoLocal = localStorage.getItem(`${idCurso}-grupo-${usuario.grupo}-modulo-${i + 1}`) === "true";
    if (habilitado && completadoLocal) completados++;

    const moduloDiv = document.createElement("div");
    moduloDiv.classList.add("modulo", "card");

    moduloDiv.innerHTML = `
      <div class="modulo-header">
        <h3>${mod.titulo}</h3>
        <span class="status">${completadoLocal ? "✔ Completado" : "👉 Disponible"}</span>
      </div>
      <div class="modulo-content">
        <a href="${mod.url}" class="btn">Ir al módulo</a>
        <button class="completar-btn ${completadoLocal ? "completado" : ""}">
          ${completadoLocal ? "✔ Completado" : "Marcar como completado"}
        </button>
      </div>
    `;

    // Botón completar
    const btn = moduloDiv.querySelector(".completar-btn");
    btn.addEventListener("click", async () => {
      await completarModulo(idCurso, usuario.grupo, i + 1, usuario.email);
      localStorage.setItem(`${idCurso}-grupo-${usuario.grupo}-modulo-${i + 1}`, "true");
      renderModulos();
    });

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
document.addEventListener("DOMContentLoaded", renderModulos);
