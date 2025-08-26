// URL de tu Apps Script (el que valida registro/login contra Google Sheets)
const API_URL = "https://script.google.com/macros/s/AKfycbwhyVWmI6Q4tImVoXfaKNYmsV87g_2RDJq6uUQoJTd5dT11nyhe3TJzQmtAmJMVGyXCdQ/exec";

// -----------------------------
// Registro
// -----------------------------
document.getElementById("registro-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const estado = document.getElementById("estado");

  const form = new FormData(e.target);
  const data = {
    action: "registro",
    nombre: form.get("nombre"),
    email: form.get("email"),
    pass: form.get("pass")
  };

  try {
    const resp = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });
    const result = await resp.json();
    estado.innerText = result.msg;

    if (result.success) {
      setTimeout(() => window.location.href = "login.html", 1500);
    }
  } catch (err) {
    estado.innerText = "⚠️ Error en la conexión.";
    console.error(err);
  }
});

// -----------------------------
// Login
// -----------------------------
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const estado = document.getElementById("estado");

  const form = new FormData(e.target);
  const data = {
    action: "login",
    email: form.get("email"),
    pass: form.get("pass")
  };

  try {
    const resp = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });
    const result = await resp.json();
    estado.innerText = result.msg;

    if (result.success) {
      localStorage.setItem("usuario", JSON.stringify(result.usuario));
      setTimeout(() => window.location.href = "../index.html", 1000);
    }
  } catch (err) {
    estado.innerText = "⚠️ Error en la conexión.";
    console.error(err);
  }
});

// -----------------------------
// Chequear sesión
// -----------------------------
function getUsuario() {
  return JSON.parse(localStorage.getItem("usuario"));
}

function logout() {
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
}
