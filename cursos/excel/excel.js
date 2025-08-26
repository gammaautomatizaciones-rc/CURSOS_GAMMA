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
const API_PROGRESO = "https://script.google.com/macros/s/AKfycbxgdAQWh4tSi93ykTAKo_Rs3k8EpBr3L67npGgzBBO7JAjUrKRxn4yy0gWhzmMf-31O0A/exec"; 

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
    return { success: false, modulos: [] };
  }
}

async function obtenerProgresoAlumno(curso, email) {
  return await postBackend({ action: "verAlumno", curso, email });
}

// =============================
// Render principal
// =============================
async function renderModulos() {
  const lista = document.getElementById("lista-modulos");
  lista.innerHTML = "⏳ Cargando módulos...";

  const backendData = await obtenerProgresoAlumno("excel", usuario.email);
  const modulosData = backendData.success ? backendData.modulos || [] : [];

  lista.innerHTML = "";
  completados = 0;

  for (let i = 1; i <= totalModulos; i++) {
    const estado = modulosData.find(m => m.modulo == i);

    if (!estado || (estado.habilitado !== true && estado.habilitado !== "TRUE")) {
      continue; // no mostrar módulos bloqueados
    }

    const completado = estado.completado === true || estado.completado === "TRUE";
    const nota = estado.nota ?? "—";

    const div = document.createElement("div");
    div.classList.add("modulo-card");
    if (completado) div.classList.add("done");

    div.innerHTML = `
      <h3>Módulo ${i}</h3>
      <p class="status">${completado ? "✔ Completado" : "👉 Disponible"}</p>
      <p class="nota">Nota: ${nota}</p>
      <div class="acciones">
        <a href="modulos/modulo${i}.html" class="btn">Ir al módulo</a>
      </div>
    `;

    if (completado) completados++;
    lista.appendChild(div);
  }

  actualizarProgreso();
}

// =============================
// Barra de progreso
// =============================
function actualizarProgreso() {
  const porcentaje = totalModulos > 0 ? Math.round((completados / totalModulos) * 100) : 0;
  document.getElementById("barra-progreso").style.width = `${porcentaje}%`;
  document.getElementById("texto-progreso").innerText =
    `${completados} de ${totalModulos} módulos completados`;
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
