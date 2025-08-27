// =============================
// Verificar sesión
// =============================
const usuario = JSON.parse(localStorage.getItem("usuario"));
if (!usuario) {
  window.location.href = "../../auth/login.html";
}

// =============================
// Barra de progreso
// =============================
function actualizarProgreso(habilitados, total = 12) {
  const porcentaje = total > 0 ? Math.round((habilitados / total) * 100) : 0;
  document.getElementById("barra-progreso").style.width = `${porcentaje}%`;
  document.getElementById("texto-progreso").innerText =
    `${habilitados} de ${total} módulos habilitados`;
}

// =============================
// Logout
// =============================
function logout() {
  localStorage.removeItem("usuario");
  window.location.href = "../../auth/login.html";
}
