// =============================
// Verificar sesión
// =============================
const usuario = JSON.parse(localStorage.getItem("usuario"));
if (!usuario) {
  window.location.href = "../../auth/login.html";
}

// =============================
// Configuración
// =============================
const API_MODULOS = "https://script.google.com/macros/s/AKfycbxUob44NSdRXwOKRj6T31vYFs8fB0K87s59SLlgHkYouqkEB6CTLUCAgOgK1gBO77i2/exec";
const TOTAL_MODULOS = 12;

// =============================
// Helpers backend
// =============================
async function postBackend(data) {
  try {
    const resp = await fetch(API_MODULOS, {
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

async function obtenerModulos(curso, grupo) {
  return await postBackend({ 
    action: "getModulosGrupo", 
    curso: String(curso).toLowerCase().trim(), 
    grupo: String(grupo).trim() 
  });
}

// =============================
// Render principal
// =============================
async function renderModulos() {
  const lista = document.getElementById("lista-modulos");
  lista.innerHTML = "⏳ Cargando módulos...";

  const backendData = await obtenerModulos("excel", usuario.grupo);
  const modulosData = backendData.success ? backendData.progreso || [] : [];

  lista.innerHTML = "";

  if (modulosData.length === 0) {
    lista.innerHTML = "<p>⚠️ No hay módulos habilitados para tu grupo.</p>";
    return;
  }

  for (let i = 1; i <= TOTAL_MODULOS; i++) {
    const estado = modulosData.find(m => String(m.modulo).trim() === String(i));
    const habilitado = String(estado?.habilitado).toLowerCase().trim();

    if (!estado || habilitado !== "true") continue;

    const card = document.createElement("div");
    card.classList.add("modulo-card");

    const urlModulo = `./modulos/modulo${i}.html`;
    console.log("DEBUG → URL módulo:", urlModulo);

    card.innerHTML = `
      <h3>Módulo ${i}</h3>
      <p class="status">👉 Disponible</p>
      <a href="modulos/modulo${i}.html" class="btn">Ir</a>
    `;

    lista.appendChild(card);
  }
}

// =============================
// Inicializar
// =============================
document.addEventListener("DOMContentLoaded", renderModulos);
