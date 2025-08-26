// =============================
// Verificar sesión
// =============================
const usuario = JSON.parse(localStorage.getItem("usuario"));
if (!usuario) {
  window.location.href = "../../auth/login.html";
}

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
const PROGRESO_API_URL = "TU_URL_DE_APPS_SCRIPT"; // tu endpoint de progreso

const cursos = {
  excel: {
    titulo: "Curso Intensivo de Excel",
    descripcion: "Un curso de 3 meses (12 clases) para dominar Excel desde cero hasta avanzado.",
    modulos: Array.from({ length: 12 }, (_, i) => ({
      titulo: `Módulo ${i + 1}`,
      url: `cursos/excel/modulos/modulo${i + 1}.html`
    }))
  },
  make: {
    titulo: "Curso de Make",
    descripcion: "Aprendé a automatizar con Make en 8 módulos prácticos.",
    modulos: Array.from({ length: 8 }, (_, i) => ({
      titulo: `Módulo ${i + 1}`,
      url: `cursos/make/modulos/modulo${i + 1}.html`
    }))
  }
  // 👉 podés seguir agregando cursos sin tocar nada más
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
    return { success: false, progreso: [] };
  }
}

async function obtenerProgreso(curso, grupo) {
  return await postBackend({ action: "getProgresoGrupo", curso, grupo });
}

// =============================
// Render principal
// =============================
async function renderModulos() {
  const curso = cursos[idCurso];
  if (!curso) {
    document.getElementById("lista-modulos").innerHTML =
      "<p>⚠️ Curso no encontrado.</p>";
    return;
  }

  completados = 0;

  // Títulos
  document.getElementById("titulo-curso").innerText = curso.titulo;
  document.getElementById("descripcion-curso").innerText = curso.descripcion;

  const lista = document.getElementById("lista-modulos");
  lista.innerHTML = "";

  // Traer info de backend según curso y grupo
  const backendData = await obtenerProgreso(idCurso, usuario.grupo);
  const modulosData = backendData.success ? backendData.progreso || [] : [];

  curso.modulos.forEach((mod, i) => {
    const estado = modulosData.find(m => m.modulo == i + 1);

    // si no está en la tabla o está deshabilitado → no mostrar
    if (!estado || estado.habilitado !== "TRUE") return;

    const completado = estado.completado === "TRUE";

    const moduloDiv = document.createElement("div");
    moduloDiv.classList.add("modulo-card");
    if (completado) moduloDiv.classList.add("done");

    moduloDiv.innerHTML = `
      <h3>${mod.titulo}</h3>
      <p class="status">${completado ? "✔ Completado" : "👉 Disponible"}</p>
      <div class="acciones">
        <a href="${mod.url}" class="btn">Ir al módulo</a>
      </div>
    `;

    if (completado) completados++;

    lista.appendChild(moduloDiv);
  });

  actualizarProgreso(curso.modulos.length);
}

// =============================
// Barra de progreso
// =============================
function actualizarProgreso(total) {
  const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;
  document.getElementById("barra-progreso").style.width = `${porcentaje}%`;
  document.getElementById("texto-progreso").innerText =
    `${completados} de ${total} módulos completados`;
}

// =============================
// Inicializar
// =============================
document.addEventListener("DOMContentLoaded", renderModulos);
