document.addEventListener("DOMContentLoaded", async () => {
  let usuario = null;
  try {
    usuario = JSON.parse(localStorage.getItem("usuario"));
  } catch (err) { usuario = null; }

  if (!usuario || !usuario.email) {
    window.location.href = "../auth/login.html";
    return;
  }

  try {
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: "getEstadoModulo",
        email: usuario.email,
        modulo: 1,
        curso: "excel",
        grupo: "1"
      })
    });
    const result = await resp.json();

    // ==== Práctico 1 ====
    if (result.practico1 === "true" || result.practico1 === "COMPLETADO") {
      document.getElementById("linkPractico1").classList.add("estado-bloqueado");
      document.getElementById("estadoPractico1").textContent = "✅ Realizado";
      document.getElementById("estadoPractico1").className = "estado-ok";
    }

    // ==== Práctico 2 ====
    if (result.practico2 === "true" || result.practico2 === "COMPLETADO") {
      document.getElementById("linkPractico2").classList.add("estado-bloqueado");
      document.getElementById("estadoPractico2").textContent = "✅ Realizado";
      document.getElementById("estadoPractico2").className = "estado-ok";
    }

    // ==== Parcial 1 ====
    if (result.parcial1 === "APROBADO") {
      document.getElementById("linkParcial1").classList.add("estado-bloqueado");
      document.getElementById("estadoParcial1").textContent = "✅ Aprobado";
      document.getElementById("estadoParcial1").className = "estado-ok";
    } else if (result.parcial1 === "RECUPERATORIO") {
      document.getElementById("estadoParcial1").textContent = "⚠️ Recuperatorio desde mañana";
      document.getElementById("estadoParcial1").className = "estado-warning";
    }

  } catch (err) {
    console.error("Error al consultar estado:", err);
  }
});
