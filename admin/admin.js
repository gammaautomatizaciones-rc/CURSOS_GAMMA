// =============================
// Validar sesión y rol
// =============================
const usuario = JSON.parse(localStorage.getItem("usuario"));
if (!usuario) {
  window.location.href = "../auth/login.html";
}

// =============================
// Helper para mostrar estado
// =============================
function setEstado(el, msg, ok = null) {
  el.innerText = msg;
  el.style.color = ok === true ? "green" : ok === false ? "red" : "black";
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

    setEstado(estado, "⏳ Procesando...");
    const result = await apiCall(accion, { email: usuario.email, curso, grupo, modulo });
    setEstado(estado, result.msg, result.success);
  });
});

// =============================
// 2. Notas
// =============================
document.querySelectorAll("#form-nota button").forEach(btn => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    const estado = document.getElementById("estado-nota");
    const emailAlumno = document.getElementById("email-nota").value.trim().toLowerCase();
    const curso = document.getElementById("curso-nota").value;
    const grupo = document.getElementById("grupo-nota").value;
    const modulo = document.getElementById("modulo-nota").value;
    const nota = document.getElementById("nota").value;
    const tp1 = document.getElementById("tp1").value;
    const tp2 = document.getElementById("tp2").value;
    const accion = btn.dataset.action; // guardarNota / modificarNota / eliminarNota

    setEstado(estado, "⏳ Procesando...");
    const result = await apiCall(accion, {
      email: usuario.email,
      alumnoEmail: emailAlumno,
      curso, grupo, modulo, nota, tp1, tp2
    });
    setEstado(estado, result.msg, result.success);
  });
});

// =============================
// 3. Grupo
// =============================
document.querySelectorAll("#form-grupo button").forEach(btn => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    const estado = document.getElementById("estado-grupo");
    const emailAlumno = document.getElementById("email-alumno").value.trim().toLowerCase();
    const curso = document.getElementById("curso-alumno").value;
    const grupo = document.getElementById("grupo-alumno").value;
    const accion = btn.dataset.action; // asignarGrupo / eliminarGrupo

    setEstado(estado, "⏳ Procesando...");
    const result = await apiCall(accion, { email: usuario.email, alumnoEmail: emailAlumno, curso, grupo });
    setEstado(estado, result.msg, result.success);
  });
});

// =============================
// 4. Ver progreso individual
// =============================
document.getElementById("form-ver-alumno").addEventListener("submit", async (e) => {
  e.preventDefault();
  const resBox = document.getElementById("resultado-alumno");
  resBox.innerHTML = "⏳ Cargando...";

  const emailAlumno = document.getElementById("email-ver").value.trim().toLowerCase();
  const curso = document.getElementById("curso-ver-alumno").value;

  const result = await apiCall("verAlumno", {
    email: usuario.email,
    alumnoEmail: emailAlumno,
    curso
  });

  if (result.success && result.alumno && result.alumno.datosBD && result.alumno.datosBD.email) {
    let html = `<h3>📌 Datos alumno</h3>`;
    html += `<p><b>Email:</b> ${result.alumno.datosBD.email}<br>
             <b>Nombre:</b> ${result.alumno.datosBD.nombre}<br>
             <b>Curso:</b> ${result.alumno.datosBD.curso}<br>
             <b>Grupo:</b> ${result.alumno.datosBD.grupo}<br>
             <b>Rol:</b> ${result.alumno.datosBD.rol}</p>`;

    html += `<h3>🔑 Módulos</h3>`;
    html += (result.alumno.modulos || []).map(m =>
      `Módulo ${m.modulo}: ${m.habilitado ? "✅" : "🔒"} (${m.fecha})`
    ).join("<br>");

    html += `<h3>📝 Notas</h3>`;
    html += (result.alumno.notas || []).map(n =>
      `Módulo ${n.modulo}: Nota ${n.nota || "-"} | TP1: ${n.tp1 || "-"} | TP2: ${n.tp2 || "-"}`
    ).join("<br>");

    resBox.innerHTML = html;
  } else {
    resBox.innerHTML = result.msg || "⚠️ Alumno no encontrado o sin datos.";
  }
});

// =============================
// Logout
// =============================
document.getElementById("btn-logout").addEventListener("click", () => {
  localStorage.removeItem("usuario");
  window.location.href = "../auth/login.html";
});
