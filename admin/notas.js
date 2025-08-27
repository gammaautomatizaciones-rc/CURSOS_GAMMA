// =============================
// Configuración
// =============================
const WEBHOOK_NOTAS = "https://hook.us2.make.com/7tr94g3xzhze8euxz4pejt3j3bbioas6"; 

// =============================
// Enviar nota / prácticos
// =============================
document.getElementById("form-nota").addEventListener("submit", async (e) => {
  e.preventDefault();

  const estado = document.getElementById("estado-nota");
  estado.innerText = "⏳ Guardando...";
  estado.style.color = "black";

  // Capturamos valores
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
        action: "guardarNota",
        email,
        curso,
        grupo,
        modulo,
        nota,
        tp1,
        tp2
      })
    });

    // esperamos JSON desde Make
    if (!resp.ok) throw new Error("Respuesta HTTP no OK");

    const result = await resp.json();

    if (result.ok) {
      estado.innerText = "✅ " + (result.msg || "Nota guardada correctamente");
      estado.style.color = "green";
    } else {
      estado.innerText = "❌ " + (result.msg || "Error al guardar la nota");
      estado.style.color = "red";
    }

  } catch (err) {
    console.error("Error:", err);
    estado.innerText = "❌ Error al conectar con Make";
    estado.style.color = "red";
  }
});
