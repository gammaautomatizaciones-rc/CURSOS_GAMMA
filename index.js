// =============================
// index.js
// =============================
document.addEventListener("DOMContentLoaded", () => {
  verificarSesion();
  actualizarNavbar();
});

function actualizarNavbar() {
  const nav = document.getElementById("nav-links");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  if (usuario) {
    nav.innerHTML = `
      <li><span style="color:#fff;">👤 ${usuario.nombre} (${usuario.rol})</span></li>
      <li><button onclick="logout()">Salir</button></li>
    `;
  } else {
    nav.innerHTML = `
      <li><a href="auth/login.html">Login</a></li>
      <li><a href="auth/registro.html">Registro</a></li>
    `;
  }
}

function logout() {
  localStorage.removeItem("usuario");
  window.location.href = "auth/login.html";
}
