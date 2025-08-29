// =============================
// auth.js
// =============================

// Registro
document.getElementById("registro-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector("button[type=submit]");
  const estado = document.getElementById("estado");

  btn.disabled = true;
  btn.innerText = "⏳ Registrando...";
  estado.innerText = "";

  const formData = new FormData(form);
  const nombre = formData.get("nombre").trim();
  const email = formData.get("email").trim().toLowerCase();
  const pass = formData.get("pass").trim();

  const result = await apiCall("register", { nombre, email, pass });

  estado.innerText = result.msg;
  estado.style.color = result.success ? "green" : "red";

  btn.disabled = false;
  btn.innerText = "Registrarme";

  if (result.success) {
    estado.innerText = "✅ Registro exitoso, redirigiendo...";
    setTimeout(() => window.location.href = "login.html", 1500);
  }
});

// Login
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector("button[type=submit]");
  const estado = document.getElementById("estado");

  btn.disabled = true;
  btn.innerText = "⏳ Iniciando...";
  estado.innerText = "";

  const formData = new FormData(form);
  const email = formData.get("email").trim().toLowerCase();
  const pass = formData.get("pass").trim();

  const result = await apiCall("login", { email, pass });

  estado.innerText = result.msg;
  estado.style.color = result.success ? "green" : "red";

  btn.disabled = false;
  btn.innerText = "Iniciar Sesión";

  if (result.success) {
    // 👇 Ahora guardamos también la contraseña
    localStorage.setItem("usuario", JSON.stringify({
      ...result.user,
      pass
    }));
    setTimeout(() => window.location.href = "index.html", 1500);
  }
});

// Verificación de sesión en index
async function verificarSesion() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  if (!usuario) {
    window.location.href = "login.html";
    return;
  }
  const result = await apiCall("auth", { email: usuario.email, pass: usuario.pass });
  if (!result.success) {
    localStorage.removeItem("usuario");
    window.location.href = "login.html";
  }
}

