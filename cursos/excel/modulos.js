// =============================
// Verificar sesión
// =============================
let user = JSON.parse(localStorage.getItem("usuario"));
if (!user) {
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
    console.log("DEBUG → Enviando al backend:", data);

    const resp = await fetch(API_MODULOS, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data)
    });

    const json = await resp.json();
    console.log("DEBUG → Respuesta cruda del backend:", json);
    return json;

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

  const backendData = await obtenerModulos("excel", user.grupo);
  const modulosData = backendData.success ? backendData.progreso || [] : [];

  console.log("DEBUG → modulosData filtrado:", modulosData);

  lista.innerHTML = "";

  for (let i = 1; i <= TOTAL_MODULOS; i++) {
    const estado = modulosData.find(m => String(m.modulo).trim() === String(i));
    const habilitado = String(estado?.habilitado).toLowerCase().trim();

    console.log(`DEBUG → Módulo ${i}:`, estado);

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
