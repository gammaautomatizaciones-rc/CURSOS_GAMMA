const API_ADMIN = "https://script.google.com/macros/s/AKfycbwVC0isHcCPG9T24pwpj87HmMVX-OtGPO6S2Q0DSODzZzsPTsJ8eLHthP_ClwsBjqObMA/exec";

// 1. Habilitar módulo (por grupo)
document.getElementById("form-habilitar").addEventListener("submit", async (e) => {
  e.preventDefault();
  const estado = document.getElementById("estado-habilitar");
  estado.innerText = "⏳ Procesando...";

  const curso = document.getElementById("curso-habilitar").value;
  const grupo = document.getElementById("grupo-habilitar").value;
  const modulo = document.getElementById("modulo-habilitar").value;

  try {
    const resp = await fetch(API_ADMIN, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ action: "habilitarModulo", curso, grupo, modulo })
    });
    const result = await resp.json();
    estado.innerText = result.msg;
    estado.style.color = result.success ? "green" : "red";
  } catch {
    estado.innerText = "⚠️ Error de conexión.";
    estado.style.color = "red";
  }
});

// 2. Poner nota al alumno (individual, PROGRESOEXCEL)
document.getElementById("form-nota").addEventListener("submit", async (e) => {
  e.preventDefault();
  const estado = document.getElementById("estado-nota");
  estado.innerText = "⏳ Guardando...";

  const email = document.getElementById("email-nota").value.trim().toLowerCase();
  const curso = document.getElementById("curso-nota").value;
  const grupo = document.getElementById("grupo-nota").value;
  const modulo = document.getElementById("modulo-nota").value;
  const nota = document.getElementById("nota").value;

  try {
    const resp = await fetch(API_ADMIN, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: "ponerNota",
        email,
        curso,
        grupo,
        modulo,
        nota
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

// 3. Asignar grupo
document.getElementById("form-grupo").addEventListener("submit", async (e) => {
  e.preventDefault();
  const estado = document.getElementById("estado-grupo");
  estado.innerText = "⏳ Procesando...";

  const email = document.getElementById("email-alumno").value.trim().toLowerCase();
  const curso = document.getElementById("curso-alumno").value;
  const grupo = document.getElementById("grupo-alumno").value;

  try {
    const resp = await fetch(API_ADMIN, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ action: "asignarGrupo", email, curso, grupo })
    });
    const result = await resp.json();
    estado.innerText = result.msg;
    estado.style.color = result.success ? "green" : "red";
  } catch {
    estado.innerText = "⚠️ Error de conexión.";
    estado.style.color = "red";
  }
});

// 4. Ver progreso (por grupo)
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

// Logout
document.getElementById("btn-logout").addEventListener("click", () => {
  localStorage.removeItem("usuario");
  window.location.href = "../auth/login.html";
});
