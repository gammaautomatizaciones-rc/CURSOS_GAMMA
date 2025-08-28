// =============================
// CONFIG
// =============================
const API_URL = "https://script.google.com/macros/s/TU_DEPLOY_ID/exec"; 
// o el webhook de Make

// =============================
// Verificar respuesta individual
// =============================
function verificarRespuesta(nombre, correcta, idPregunta, explicacion) {
  const opciones = document.getElementsByName(nombre);
  let seleccion = null;
  opciones.forEach(op => { if (op.checked) seleccion = op.value; });
  const feedbackDiv = document.querySelector(`#${idPregunta} .feedback`);

  if (!seleccion) {
    feedbackDiv.innerHTML = "⚠️ Seleccioná una opción.";
    feedbackDiv.className = "feedback incorrecto";
    return false;
  }
  if (seleccion === correcta) {
    feedbackDiv.innerHTML = "✅ Correcto";
    feedbackDiv.className = "feedback correcto";
    return true;
  } else {
    feedbackDiv.innerHTML = "❌ Incorrecto. " + explicacion;
    feedbackDiv.className = "feedback incorrecto";
    return false;
  }
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
    alert("⚠️ Tenés que responder todas las preguntas correctamente antes de enviar.");
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
