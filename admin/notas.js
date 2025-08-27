// =============================
// Configuración
// =============================
const WEBHOOK_NOTAS = "https://hook.integromat.com/xxxxx"; // <-- tu URL de Make

// =============================
// Enviar nota / prácticos
// =============================
document.getElementById("form-nota").addEventListener("submit", async (e) => {
  e.preventDefault();

  const estado = document.getElementById("estado-nota");
  estado.innerText = "⏳ Guardando...";

  // Capturamos los valores del form
  const email = document.getElementById("email-nota").value.trim().toLowerCase();
  const curso = document.getElementById("curso-nota").value;
  const grupo = document.getElementById("grupo-nota").value;
  const modulo = document.getElementById("modulo-nota").value;
  const nota = document.getElementById("nota").value;
  const tp1 = document.getElementById("tp1").value;
  const tp2 = document.getElementById("tp2").value;

  if (!email || !curso || !grupo || !modulo) {
    estado.innerText = "⚠️ Faltan datos obligatorios.";
    estado.style.color = "red";
    return;
  }

  try {
    const resp = await fetch(WEBHOOK_NOTAS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "guardarNota", // lo usamos en Make para rutear
        email,
        curso,
        grupo,
        modulo,
        nota,
        tp1,
        tp2
      })
    });

    const result = await resp.json().catch(() => ({}));
    estado.innerText = result.msg || "✅ Nota guardada correctamente";
    estado.style.color = "green";
  } catch (err) {
    console.error("Error:", err);
    estado.innerText = "❌ Error al conectar con el servidor";
    estado.style.color = "red";
  }
});
