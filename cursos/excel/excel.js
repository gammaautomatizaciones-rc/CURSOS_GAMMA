// =============================
// Verificar sesión
// =============================
const usuarioExcel = JSON.parse(localStorage.getItem("usuario"));
if (!usuarioExcel) {
  window.location.href = "../../auth/login.html";
}

// =============================
// Configuración
// =============================
const API_EXCEL = "https://script.google.com/macros/s/AKfycbw2B8VSRqmy3Y48hL9D_8eVCejQSAo9bjV2cMvUCI3VaGY_gkfHpF3jID2qmM9CcoMxkg/exec";
const TOTAL_MODULOS = 12;

// =============================
// Barra de progreso
// =============================
function actualizarProgreso(habilitados, total = TOTAL_MODULOS) {
  const porcentaje = total > 0 ? Math.round((habilitados / total) * 100) : 0;
  document.getElementById("barra-progreso").style.width = `${porcentaje}%`;
  document.getElementById("texto-progreso").innerText =
    `${habilitados} de ${total} módulos habilitados`;
}

// =============================
// Render historial
// =============================
function renderHistorial(historial) {
  const contenedor = document.getElementById("historial");

  if (!historial || (
      (!historial.habilitados || historial.habilitados.length === 0) &&
      (!historial.completados || historial.completados.length === 0) &&
      (!historial.notas || historial.notas.length === 0)
    )) {
    contenedor.innerHTML = "<p>Aquí verás tu historial próximamente</p>";
    return;
  }

  let html = "";

  // Habilitados
  if (historial.habilitados?.length > 0) {
    html += "<h3>Módulos habilitados</h3><ul>";
    historial.habilitados.forEach(h => {
      html += `<li>Módulo ${h.modulo} — habilitado el ${new Date(h.fecha).toLocaleDateString()}</li>`;
    });
    html += "</ul>";
  }

  // Completados
  if (historial.completados?.length > 0) {
    html += "<h3>Módulos completados</h3><ul>";
    historial.completados.forEach(c => {
      html += `<li>Módulo ${c.modulo} — completado el ${new Date(c.fecha).toLocaleDateString()}</li>`;
    });
    html += "</ul>";
  }

  // Notas
  if (historial.notas?.length > 0) {
    html += "<h3>Parciales y prácticos</h3><ul>";
    historial.notas.forEach(n => {
      const tp1 = String(n.tp1).toLowerCase() === "true" ? "COMPLETADO" :
                  String(n.tp1).toLowerCase() === "false" ? "INCOMPLETO" : "-";
      const tp2 = String(n.tp2).toLowerCase() === "true" ? "COMPLETADO" :
                  String(n.tp2).toLowerCase() === "false" ? "INCOMPLETO" : "-";

      html += `<li>Módulo ${n.modulo}: Parcial ${n.nota || "-"}, Práctico 1: ${tp1}, Práctico 2: ${tp2}</li>`;
    });
    html += "</ul>";
  }

  contenedor.innerHTML = html;
}

// =============================
// Render módulos habilitados
// =============================
function renderModulos(habilitados) {
  const lista = document.getElementById("lista-modulos");
  lista.innerHTML = "";

  if (!habilitados || habilitados.length === 0) {
    lista.innerHTML = "<p>⚠️ No hay módulos habilitados para tu grupo.</p>";
    return;
  }

  habilitados.forEach(m => {
    const card = document.createElement("div");
    card.classList.add("modulo-card");

    card.innerHTML = `
      <h3>Módulo ${m.modulo}</h3>
      <p class="status">👉 Disponible</p>
      <a href="modulos/modulo${m.modulo}.html" class="btn">Ir</a>
    `;

    lista.appendChild(card);
  });
}

// =============================
// Cargar datos desde backend
// =============================
async function cargarDatos() {
  try {
    const resp = await fetch(API_EXCEL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: "getHistorialAlumno",
        curso: "excel",
        grupo: usuarioExcel.grupo,
        email: usuarioExcel.email
      })
    });

    const result = await resp.json();
    console.log("Historial recibido:", result);

    if (result.success) {
      const historial = result.historial || {};
        // 🔽 ORDENAR ARRAYS POR MÓDULO
          if (historial.habilitados) {
            historial.habilitados.sort((a, b) => Number(a.modulo) - Number(b.modulo));
          }
          if (historial.completados) {
            historial.completados.sort((a, b) => Number(a.modulo) - Number(b.modulo));
          }
          if (historial.notas) {
            historial.notas.sort((a, b) => Number(a.modulo) - Number(b.modulo));
          }
      // Barra de progreso
      const habilitadosCount = historial.habilitados ? historial.habilitados.length : 0;
      actualizarProgreso(habilitadosCount);

      // Render historial
      renderHistorial(historial);

      // Render módulos habilitados
      renderModulos(historial.habilitados);
    } else {
      console.warn("Respuesta no exitosa:", result.msg);
    }
  } catch (err) {
    console.error("Error cargando datos:", err);
  }
}

document.addEventListener("DOMContentLoaded", cargarDatos);

// =============================
// Logout
// =============================
function logout() {
  localStorage.removeItem("usuario");
  window.location.href = "../../auth/login.html";
}
