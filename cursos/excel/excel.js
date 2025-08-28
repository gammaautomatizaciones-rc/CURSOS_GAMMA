// =============================
// Verificar sesión
// =============================
const usuarioExcel = JSON.parse(localStorage.getItem("usuario"));
if (!usuarioExcel) {
  window.location.href = "../../auth/login.html";
}

// =============================
// Barra de progreso
// =============================
function actualizarProgreso(habilitados, total = 12) {
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
  if (historial.habilitados && historial.habilitados.length > 0) {
    html += "<h3>Módulos habilitados</h3><ul>";
    historial.habilitados.forEach(h => {
      html += `<li>Módulo ${h.modulo} — habilitado el ${new Date(h.fecha).toLocaleDateString()}</li>`;
    });
    html += "</ul>";
  }

  // Completados
  if (historial.completados && historial.completados.length > 0) {
    html += "<h3>Módulos completados</h3><ul>";
    historial.completados.forEach(c => {
      html += `<li>Módulo ${c.modulo} — completado el ${new Date(c.fecha).toLocaleDateString()}</li>`;
    });
    html += "</ul>";
  }

  // Notas
  if (historial.notas && historial.notas.length > 0) {
    html += "<h3>Notas y trabajos prácticos</h3><ul>";
    historial.notas.forEach(n => {
      html += `<li>Módulo ${n.modulo}: Nota ${n.nota || "-"}, TP1 ${n.tp1 || "-"}, TP2 ${n.tp2 || "-"}</li>`;
    });
    html += "</ul>";
  }

  contenedor.innerHTML = html;
}

// =============================
// Cargar progreso e historial
// =============================
async function cargarProgreso() {
  try {
    const resp = await fetch("https://script.google.com/macros/s/AKfycbyy0_UUzAEENL44GSYlzHubr-tvNOtQJsWQ7X6B6lfPnKSkK18VUNs1H5NHbkaohdJLrw/exec", {
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
    if (result.success) {
      // Actualizar barra de progreso
      const habilitados = result.historial.habilitados ? result.historial.habilitados.length : 0;
      actualizarProgreso(habilitados, 12);

      // Render historial
      renderHistorial(result.historial);
    } else {
      console.warn("Respuesta no exitosa:", result.msg);
    }
  } catch (err) {
    console.error("Error cargando progreso:", err);
  }
}

document.addEventListener("DOMContentLoaded", cargarProgreso);

// =============================
// Logout
// =============================
function logout() {
  localStorage.removeItem("usuario");
  window.location.href = "../../auth/login.html";
}
