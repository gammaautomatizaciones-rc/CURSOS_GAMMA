// =============================
// auth.js (mejorado con debug)
// =============================

// Helper para mostrar estado en pantalla
function setEstado(el, msg, ok = null) {
  if (!el) return;
  el.innerText = msg;
  el.style.color = ok === true ? "green" : ok === false ? "red" : "black";
}

// =============================
// Registro
// =============================
document.getElementById("registro-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector("button[type=submit]");
  const estado = document.getElementById("estado");

  btn.disabled = true;
  btn.innerText = "⏳ Registrando...";
  setEstado(estado, "");

  const formData = new FormData(form);
  const nombre = formData.get("nombre").trim();
  const email = formData.get("email").trim().toLowerCase();
  const pass = formData.get("pass").trim();

  const result = await apiCall("register", { nombre, email, pass });
  console.log("🔎 Respuesta backend (register):", result);

  setEstado(estado, result.msg, result.success);

  btn.disabled = false;
  btn.innerText = "Registrarme";

  if (result.success) {
    setEstado(estado, "✅ Registro exitoso, redirigiendo...", true);
    setTimeout(() => window.location.href = "login.html", 1200);
  }
});

// =============================
// Login
// =============================
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector("button[type=submit]");
  const estado = document.getElementById("estado");

  btn.disabled = true;
  btn.innerText = "⏳ Iniciando...";
  setEstado(estado, "");

  const formData = new FormData(form);
  const email = formData.get("email").trim().toLowerCase();
  const pass = formData.get("pass").trim();

  const result = await apiCall("login", { email, pass });
  console.log("🔎 Respuesta backend (login):", result);

  setEstado(estado, result.msg, result.success);

  btn.disabled = false;
  btn.innerText = "Iniciar Sesión";

  if (result.success) {
    // Guardamos también el pass para validar sesión después
    localStorage.setItem("usuario", JSON.stringify({
      ...result.user,
      pass
    }));
    setTimeout(() => window.location.href = "../index.html", 1200);
  }
});

// =============================
// Verificación de sesión en index
// =============================
async function verificarSesion() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  if (!usuario) {
    console.warn("⚠️ No hay usuario en localStorage, redirigiendo a login...");
    window.location.href = "auth/login.html";
    return;
  }

  const result = await apiCall("auth", { email: usuario.email, pass: usuario.pass });
  console.log("🔎 Respuesta backend (auth):", result);

  if (!result.success) {
    console.warn("⚠️ Sesión inválida, borrando datos y redirigiendo.");
    localStorage.removeItem("usuario");
    window.location.href = "auth/login.html";
  }
}
