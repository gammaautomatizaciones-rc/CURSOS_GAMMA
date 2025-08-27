// =============================
// Configuración
// =============================
const API_ADMIN = "https://script.google.com/macros/s/AKfycbwOuvp4ZacK4xlNJcwONE2Bk5vmEs3lCwckldEoTg7rlKG9AVz9jvTp_AZVrJFEFzUz9g/exec";

// =============================
// Helper para enviar POST
// =============================
async function enviarAccion(accion, params, estadoEl) {
  estadoEl.innerText = "⏳ Procesando...";
  try {
    const resp = await fetch(API_ADMIN, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ action: accion, ...params })
    });
    const result = await resp.json();
    estadoEl.innerText = result.msg;
    estadoEl.style.color = result.success ? "green" : "red";
  } catch {
    estadoEl.innerText = "⚠️ Error de conexión.";
    estadoEl.style.color = "red";
  }
}

// =============================
// 1. Módulos
// =============================
document.querySelectorAll("#form-habilitar button").forEach(btn => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    const estado = document.getElementById("estado-habilitar");
    const curso = document.getElementById("curso-habilitar").value;
    const grupo = document.getElementById("grupo-habilitar").value;
    const modulo = document.getElementById("modulo-habilitar").value;
    const accion = btn.dataset.action; // habilitarModulo / modificarModulo / eliminarModulo

    await enviarAccion(accion, { curso, grupo, modulo }, estado);
  });
});

// =============================
// 2. Notas
// =============================
document.querySelectorAll("#form-nota button").forEach(btn => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    const estado = document.getElementById("estado-nota");
    const email = document.getElementById("email-nota").value.trim().toLowerCase();
    const curso = document.getElementById("curso-nota").value;
    const grupo = document.getElementById("grupo-nota").value;
    const modulo = document.getElementById("modulo-nota").value;
    const nota = document.getElementById("nota").value;
    const tp1 = document.getElementById("tp1").value;
    const tp2 = document.getElementById("tp2").value;
    const accion = btn.dataset.action; // guardarNota / modificarNota / eliminarNota

    await enviarAccion(accion, { email, curso, grupo, modulo, nota, tp1, tp2 }, estado);
  });
});

// =============================
// 3. Grupo
// =============================
document.querySelectorAll("#form-grupo button").forEach(btn => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    const estado = document.getElementById("estado-grupo");
    const email = document.getElementById("email-alumno").value.trim().toLowerCase();
    const curso = document.getElementById("curso-alumno").value;
    const grupo = document.getElementById("grupo-alumno").value;
    const accion = btn.dataset.action; // asignarGrupo / eliminarGrupo

    await enviarAccion(accion, { email, curso, grupo }, estado);
  });
});

// =============================
// 4. Ver progreso por grupo
// =============================
document.getElementById("form-ver").addEventListener("submit", async (e) => {
  e.preventDefault();
  const resBox = document.getElementById("resultado-ver");
  resBox.innerHTML = "⏳ Cargando...";

  const curso = document.getElementById("curso-ver").value;
  const grupo = document.getElementById("grupo-ver").value;

  await enviarAccion("verGrupo", { curso, grupo }, resBox);
});

// =============================
// 5. Ver progreso individual
// =============================
document.getElementById("form-ver-alumno").addEventListener("submit", async (e) => {
  e.preventDefault();
  const resBox = document.getElementById("resultado-alumno");
  resBox.innerHTML = "⏳ Cargando...";

  const email = document.getElementById("email-ver").value.trim().toLowerCase();
  const curso = document.getElementById("curso-ver-alumno").value;

  try {
    const resp = await fetch(API_ADMIN, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ action: "verAlumno", email, curso })
    });
    const result = await resp.json();

    if (result.success) {
      let html = `<h3>📌 Datos alumno</h3>`;
      html += `<p><b>Email:</b> ${result.alumno.datosBD.email}<br>
               <b>Nombre:</b> ${result.alumno.datosBD.nombre}<br>
               <b>Curso:</b> ${result.alumno.datosBD.curso}<br>
               <b>Grupo:</b> ${result.alumno.datosBD.grupo}<br>
               <b>Rol:</b> ${result.alumno.datosBD.rol}</p>`;

      html += `<h3>🔑 Módulos</h3>`;
      html += result.alumno.modulos.map(m =>
        `Módulo ${m.modulo}: ${m.habilitado ? "✅" : "🔒"} (${m.fecha})`
      ).join("<br>");

      html += `<h3>📝 Notas</h3>`;
      html += result.alumno.notas.map(n =>
        `Módulo ${n.modulo}: Nota ${n.nota} | TP1: ${n.tp1} | TP2: ${n.tp2}`
      ).join("<br>");

      resBox.innerHTML = html;
    } else {
      resBox.innerHTML = result.msg;
    }
  } catch {
    resBox.innerHTML = "⚠️ Error de conexión.";
  }
});

// =============================
// Logout
// =============================
document.getElementById("btn-logout").addEventListener("click", () => {
  localStorage.removeItem("usuario");
  window.location.href = "../auth/login.html";
});
