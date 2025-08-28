// =============================
// CONFIG
// =============================
const API_URL = "https://script.google.com/macros/s/AKfycbzEpRX-d2cQy3tgU2m6SrD-2g80gyjF9YSaoDXofRfcnnQ4r4tEsk7hkCJ_dr3gR5zpmg/exec"; 
// o el webhook de Make

// =============================
// Verificación automática al elegir
// =============================
function autoVerificar(nombre, correcta, idPregunta, explicacion) {
  const opciones = document.getElementsByName(nombre);
  opciones.forEach(op => {
    op.addEventListener("change", () => {
      const feedbackDiv = document.querySelector(`#${idPregunta} .feedback`);
      if (op.checked) {
        if (op.value === correcta) {
          feedbackDiv.innerHTML = "✅ Correcto";
          feedbackDiv.className = "feedback correcto";
        } else {
          feedbackDiv.innerHTML = "❌ Incorrecto. " + explicacion;
          feedbackDiv.className = "feedback incorrecto";
        }
      }
    });
  });
}

// =============================
// Validar todo el cuestionario
// =============================
function validarYEnviar(config) {
  const preguntas = document.querySelectorAll(".pregunta");
  let todoCorrecto = true;

  preguntas.forEach(p => {
    const fb = p.querySelector(".feedback");
    if (!fb.classList.contains("correcto")) {
      todoCorrecto = false;
    }
  });

  if (!todoCorrecto) {
    alert("⚠️ Completá bien los campos incorrectos antes de enviar.");
    return;
  }

  // Si todo correcto → enviar datos
  const email = localStorage.getItem("usuarioEmail") || "sin_email";
  const data = {
    action: config.action,     // "practico" o "parcial"
    practico: config.practico || "",
    parcial: config.parcial || "",
    curso: config.curso || "excel",
    grupo: config.grupo || "1",
    modulo: config.modulo,
    email: email,
    estado: "COMPLETADO",
    nota: config.nota || ""
  };

  enviarAServer(data);
}

// =============================
// Enviar a servidor
// =============================
async function enviarAServer(data) {
  try {
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data)
    });
    const result = await resp.text();
    alert(result); // Mostrar respuesta de Apps Script
  } catch (err) {
    alert("❌ Error al enviar: " + err.message);
  }
}
