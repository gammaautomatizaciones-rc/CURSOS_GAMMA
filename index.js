// =============================
// index.js
// =============================
document.addEventListener("DOMContentLoaded", () => {
  verificarSesion();
  actualizarNavbar();
});

// =============================
// Navbar dinámico
// =============================
function actualizarNavbar() {
  const nav = document.getElementById("nav-links");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  if (usuario) {
    // 👇 Si no hay nombre, mostramos el email
    const nombreMostrar = usuario.nombre && usuario.nombre.trim() !== "" 
      ? usuario.nombre 
      : usuario.email;

    nav.innerHTML = `
      <li><span style="color:#fff;">👤 ${nombreMostrar}</span></li>
      <li><button onclick="logout()">Salir</button></li>
    `;
  } else {
    nav.innerHTML = `
      <li><a href="auth/login.html">Login</a></li>
      <li><a href="auth/registro.html">Registro</a></li>
    `;
  }
}

// =============================
// Logout
// =============================
function logout() {
  localStorage.removeItem("usuario");
  window.location.href = "auth/login.html";
}
