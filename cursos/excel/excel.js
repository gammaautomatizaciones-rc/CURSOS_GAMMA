// =============================
// Verificar sesión
// =============================
const usuario = JSON.parse(localStorage.getItem("usuario"));
if (!usuario) {
  window.location.href = "../../auth/login.html";
}

let completados = 0;
const totalModulos = 12;

// =============================
// Configuración
// =============================
const API_PROGRESO = "https://script.google.com/macros/s/AKfycbxpyTj1xzLog9RUVH-q_wVb_3FzMy2W66LbPymt_06Y7DeeboOXqhLN2ageN69S9OPslA/exec"; // ⚠️ poné la URL del deploy de PROGRESO.gs

// =============================
// Helpers backend
// =============================
async function postBackend(data) {
  try {
    const resp = await fetch(API_PROGRESO, {
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

async function obtenerProgresoGrupo(curso, grupo) {
  return await postBackend({ action: "getProgresoGrupo", curso, grupo });
}

// =============================
// Render principal
// =============================
async function renderModulos() {
  const lista = document.getElementById("lista-modulos");
  lista.innerHTML = "⏳ Cargando módulos...";

  const backendData = await obtenerProgresoGrupo("excel", usuario.grupo);
  const modulosData = backendData.success ? backendData.progreso || [] : [];

  lista.innerHTML = "";
  completados = 0;

  for (let i = 1; i <= totalModulos; i++) {
    const estado = modulosData.find(m => m.modulo == i);

    if (!estado || estado.habilitado !== true && estado.habilitado !== "TRUE") {
      continue; // no mostrar módulos bloqueados
    }

    const div = document.createElement("div");
    div.classList.add("modulo-card");

    div.innerHTML = `
      <h3>Módulo ${i}</h3>
      <p class="status">👉 Disponible</p>
      <div class="acciones">
        <a href="modulos/modulo${i}.html" class="btn">Ir al módulo</a>
      </div>
    `;

    lista.appendChild(div);
  }

  actualizarProgreso(modulosData.length);
}

// =============================
// Barra de progreso
// =============================
function actualizarProgreso(habilitados) {
  const porcentaje = totalModulos > 0 ? Math.round((habilitados / totalModulos) * 100) : 0;
  document.getElementById("barra-progreso").style.width = `${porcentaje}%`;
  document.getElementById("texto-progreso").innerText =
    `${habilitados} de ${totalModulos} módulos habilitados`;
}

// =============================
// Inicializar
// =============================
document.addEventListener("DOMContentLoaded", renderModulos);

// =============================
// Logout
// =============================
function logout() {
  localStorage.removeItem("usuario");
  window.location.href = "../../auth/login.html";
}
