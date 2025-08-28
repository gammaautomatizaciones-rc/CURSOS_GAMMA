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
// Registro
// =============================
document.getElementById("registro-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);

  setEstado("⏳ Procesando...");

  const result = await apiCall("registro", {
    nombre: form.get("nombre"),
    email: form.get("email"),
    pass: form.get("pass")
  });

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

  setEstado("⏳ Verificando...");

  const result = await apiCall("login", {
    email: form.get("email"),
    pass: form.get("pass")
  });

  setEstado(result.msg, result.success);

  if (result.success && result.usuario) {
    localStorage.setItem("usuario", JSON.stringify(result.usuario));
    setTimeout(() => window.location.href = "../index.html", 1000);
  }
});

// =============================
// Manejo de sesión
// =============================
function getUsuarioAuth() {
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

// =============================
// Refrescar datos del usuario desde la BD
// =============================
async function refreshUsuario() {
  const usuarioAuth = getUsuarioAuth();
  if (!usuarioAuth || !usuarioAuth.email) return;

  try {
    const result = await apiCall("getUsuario", { email: usuarioAuth.email });

    if (result.success && result.usuario) {
      localStorage.setItem("usuario", JSON.stringify(result.usuario));
      console.log("DEBUG → Usuario refrescado:", result.usuario);
    }
  } catch (err) {
    console.error("Error refrescando usuario:", err);
  }
}
