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
const API_MODULOS = "https://script.google.com/macros/s/AKfycbzCnvLGi_sWhNBj7IT3FEPX5IE4AVujmF6e4JjHL8fl07dhz6fSgEdUYaU3fwbxaMe5/exec";
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

  console.log("DEBUG modulosData:", modulosData); // 👈 para revisar qué devuelve el backend

  lista.innerHTML = "";

  for (let i = 1; i <= TOTAL_MODULOS; i++) {
    const estado = modulosData.find(m => String(m.modulo).trim() === String(i));

    // 🔑 normalizamos habilitado
    const habilitado = String(estado?.habilitado).toLowerCase().trim();

    if (!estado || habilitado !== "true") {
      continue; // no mostrar módulos bloqueados
    }

    const card = document.createElement("div");
    card.classList.add("modulo-card");

    card.innerHTML = `
      <h3>Módulo ${i}</h3>
      <p class="status">👉 Disponible</p>
      <a href="modulo${i}.html" class="btn">Ir</a>
    `;

    lista.appendChild(card);
  }
}

// =============================
// Inicializar
// =============================
document.addEventListener("DOMContentLoaded", renderModulos);
