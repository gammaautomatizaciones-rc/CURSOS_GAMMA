// =============================
// Configuración
// =============================
const API_ADMIN = "https://script.google.com/macros/s/AKfycbyl0zv5gjmODw5Z1ZPZ_vUdOaEnc7raSi0h19Jvcx6m-1AwVtPDODDHTXTmA2Ab6kyPtQ/exec";

// =============================
// 1. Habilitar / Modificar / Eliminar módulo
// =============================
document.getElementById("form-habilitar").addEventListener("submit", async (e) => {
  e.preventDefault();
  const estado = document.getElementById("estado-habilitar");
  estado.innerText = "⏳ Procesando...";

  const curso = document.getElementById("curso-habilitar").value;
  const grupo = document.getElementById("grupo-habilitar").value;
  const modulo = document.getElementById("modulo-habilitar").value;
  const accion = document.getElementById("accion-habilitar").value; // habilitar / modificar / eliminar

  try {
    const resp = await fetch(API_ADMIN, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ action: accion + "Modulo", curso, grupo, modulo })
    });
    const result = await resp.json();
    estado.innerText = result.msg;
    estado.style.color = result.success ? "green" : "red";
  } catch {
    estado.innerText = "⚠️ Error de conexión.";
    estado.style.color = "red";
  }
});

// =============================
// 2. Guardar / Modificar / Eliminar Nota
// =============================
document.getElementById("form-nota").addEventListener("submit", async (e) => {
  e.preventDefault();
  const estado = document.getElementById("estado-nota");
  estado.innerText = "⏳ Guardando...";

  const email = document.getElementById("email-nota").value.trim().toLowerCase();
  const curso = document.getElementById("curso-nota").value;
  const grupo = document.getElementById("grupo-nota").value;
  const modulo = document.getElementById("modulo-nota").value;
  const nota = document.getElementById("nota").value;
  const tp1 = document.getElementById("tp1").value;
  const tp2 = document.getElementById("tp2").value;
  const accion = document.getElementById("accion-nota").value; // guardar / modificar / eliminar

  try {
    const resp = await fetch(API_ADMIN, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: accion + "Nota",
        email,
        curso,
        grupo,
        modulo,
        nota,
        tp1,
        tp2
      })
    });
    const result = await resp.json();
    estado.innerText = result.msg;
    estado.style.color = result.success ? "green" : "red";
  } catch {
    estado.innerText = "⚠️ Error de conexión.";
    estado.style.color = "red";
  }
});

// =============================
// 3. Asignar / Eliminar grupo
// =============================
document.getElementById("form-grupo").addEventListener("submit", async (e) => {
  e.preventDefault();
  const estado = document.getElementById("estado-grupo");
  estado.innerText = "⏳ Procesando...";

  const email = document.getElementById("email-alumno").value.trim().toLowerCase();
  const curso = document.getElementById("curso-alumno").value;
  const grupo = document.getElementById("grupo-alumno").value;
  const accion = document.getElementById("accion-grupo").value; // asignar / eliminar

  try {
    const resp = await fetch(API_ADMIN, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ action: accion + "Grupo", email, curso, grupo })
    });
    const result = await resp.json();
    estado.innerText = result.msg;
    estado.style.color = result.success ? "green" : "red";
  } catch {
    estado.innerText = "⚠️ Error de conexión.";
    estado.style.color = "red";
  }
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

  try {
    const resp = await fetch(API_ADMIN, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ action: "verGrupo", curso, grupo })
    });
    const result = await resp.json();

    if (result.success) {
      resBox.innerHTML = result.modulos.map(m => 
        `Módulo ${m.modulo}: ${m.habilitado ? "✅ Habilitado" : "🔒 Bloqueado"} | Nota: ${m.nota ?? "—"}`
      ).join("<br>");
    } else {
      resBox.innerHTML = result.msg;
    }
  } catch {
    resBox.innerHTML = "⚠️ Error de conexión.";
  }
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
