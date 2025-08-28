// =============================
// CONFIG
// =============================
const API_URL = "https://script.google.com/macros/s/AKfycbzEpRX-d2cQy3tgU2m6SrD-2g80gyjF9YSaoDXofRfcnnQ4r4tEsk7hkCJ_dr3gR5zpmg/exec"; 
const API_WHOAMI = "https://script.google.com/macros/s/AKfycbzg2BcTThPg91l-FJDZZ4Ejmz9JOqE8-IomtX3RphlWJAraHelYAm4S1fh4pqIDFC7HOQ/exec";

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
// Validar y enviar (Prácticos y Parciales)
// =============================
async function validarYEnviar(config) {
  const btn = document.getElementById("btnEnviar");
  btn.disabled = true;
  btn.innerText = "⏳ Guardando...";

  // ✅ Tomar usuario logueado
  let usuario = null;
  try {
    usuario = JSON.parse(localStorage.getItem("usuario"));
  } catch (err) {
    usuario = null;
  }
  if (!usuario || !usuario.email) {
    alert("❌ No se encontró un usuario logueado. Volvé a iniciar sesión.");
    window.location.href = "../auth/login.html";
    return;
  }

  // ✅ Si es práctico → chequear que todas correctas
  if (config.action === "practico") {
    const preguntas = document.querySelectorAll(".pregunta");
    let todoCorrecto = true;
    preguntas.forEach(p => {
      const fb = p.querySelector(".feedback");
      if (!fb.classList.contains("correcto")) {
        todoCorrecto = false;
      }
    });
    if (!todoCorrecto) {
      alert("⚠️ Completá bien las respuestas antes de enviar.");
      btn.disabled = false;
      btn.innerText = "Enviar Práctico";
      return;
    }
  }

  // ✅ Recopilar respuestas (válido para ambos)
  let respuestas = {};
  const camposTexto = document.querySelectorAll("textarea");
  const radios = document.querySelectorAll("input[type=radio]:checked");

  camposTexto.forEach(campo => {
    respuestas[campo.name] = campo.value.trim();
  });
  radios.forEach(r => {
    respuestas[r.name] = r.value;
  });

  const data = {
    action: config.action,     // practico | parcial
    practico: config.practico || "",
    parcial: config.parcial || "",
    curso: config.curso || "excel",
    grupo: config.grupo || "1",
    modulo: config.modulo,
    email: usuario.email,
    estado: config.action === "practico" ? "true" : "COMPLETADO",
    nota: config.nota || "",
    respuestas: JSON.stringify(respuestas)
  };

  await enviarAServer(data, btn, usuario, respuestas);
}

// =============================
// Enviar a servidor + email
// =============================
async function enviarAServer(data, btn, usuario, respuestas) {
  try {
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data)
    });
    const result = await resp.text();

    alert(result);

    // Enviar mail al alumno y a Gamma
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: "enviarMail",
        to: usuario.email,
        cc: "gamma.automatizaciones@gmail.com",
        subject: "Entrega de alumno",
        body: `Alumno: ${usuario.email}\nMódulo: ${data.modulo}\nActividad: ${data.action}\n\nRespuestas:\n${JSON.stringify(respuestas, null, 2)}`
      })
    });

    // Redirigir
    window.location.href = "../modulos/modulo" + data.modulo + ".html";

  } catch (err) {
    alert("❌ Error al enviar: " + err.message);
    if (btn) {
      btn.disabled = false;
      btn.innerText = "Enviar";
    }
  }
}
