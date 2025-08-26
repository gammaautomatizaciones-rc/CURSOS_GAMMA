// =============================
// Configuración
// =============================
const API_URL = "https://script.google.com/macros/s/AKfycbzfZhBZlIbCtutOgu0BjPbXVzXmPcK7AEMm7dm_M50nFjPOuQvToKLxW4CnF5-8K5thYQ/exec"; // URL del deploy de auth.gs

// =============================
// Helper para mostrar mensajes
// =============================
function setEstado(msg, ok = null) {
  const estado = document.getElementById("estado");
  if (!estado) return;

  estado.innerText = msg;
  estado.style.color = ok === true ? "green" : ok === false ? "red" : "black";
}

// =============================
// Helper para enviar datos al servidor
// =============================
async function enviarDatos(data) {
  try {
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data)
    });

    if (!resp.ok) throw new Error("Error en la red");

    const result = await resp.json();
    return result;
  } catch (err) {
    console.error("Error conexión:", err);
    return { success: false, msg: "⚠️ No se pudo conectar al servidor." };
  }
}

// =============================
// Registro
// =============================
document.getElementById("registro-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = new FormData(e.target);
  const data = {
    action: "registro",
    nombre: form.get("nombre"),
    email: form.get("email"),
    pass: form.get("pass")
  };

  setEstado("⏳ Procesando...");

  const result = await enviarDatos(data);
  setEstado(result.msg, result.success);

  if (result.success) {
    setTimeout(() => window.location.href = "login.html", 1500);
  }
});

// =============================
// Login
// =============================
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = new FormData(e.target);
  const data = {
    action: "login",
    email: form.get("email"),
    pass: form.get("pass")
  };

  setEstado("⏳ Verificando...");

  const result = await enviarDatos(data);
  setEstado(result.msg, result.success);

  if (result.success && result.usuario) {
    localStorage.setItem("usuario", JSON.stringify(result.usuario));
    setTimeout(() => window.location.href = "../index.html", 1000);
  }
});

// =============================
// Manejo de sesión
// =============================
function getUsuario() {
  try {
    return JSON.parse(localStorage.getItem("usuario"));
  } catch {
    return null;
  }
}

function logout() {
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
}

