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
// Cargar progreso desde backend
// =============================
async function cargarProgreso() {
  try {
    const resp = await fetch("https://script.google.com/macros/s/AKfycbyE3jT9eDL0OtmzNelkUtwoC2PqqSzogKq18s89yj5ayIPJIAlzZEU1a2v4YzxNiEeH8A/exec", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: "contarProgreso",
        curso: "excel",
        grupo: usuario.grupo
      })
    });

    const result = await resp.json();
    if (result.success) {
      actualizarProgreso(result.habilitados, 12);
    } else {
      console.warn("No se pudo cargar progreso:", result.msg);
    }
  } catch (err) {
    console.error("Error cargando progreso:", err);
  }
}

document.addEventListener("DOMContentLoaded", cargarProgreso);

// =============================
// Logout
// =============================
function logout() {
  localStorage.removeItem("usuario");
  window.location.href = "../../auth/login.html";
}
