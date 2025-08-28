const parcialConfig = {
  action: "parcial",
  parcial: "P1",
  modulo: 1,
  curso: "excel",
  grupo: "1"
};

// =============================
// Respuestas correctas (10 pts c/u)
// =============================
const correctas = {
  q1: "celda",        // se validará con includes
  q2: "libro",
  q3: "=a1+b1",
  q4: "4",
  q5: "referencia",
  q6: "*,/",
  q7: "div/0",
  q8: "texto",
  q9: "=promedio",
  q10: "xlsx"
};

// =============================
// Timer 60 minutos
// =============================
let tiempoRestante = 60 * 60; // 60 min en segundos
const timerEl = document.getElementById("timer");

function actualizarTimer() {
  let min = Math.floor(tiempoRestante / 60);
  let seg = tiempoRestante % 60;
  timerEl.textContent = `${min}:${seg.toString().padStart(2, "0")}`;
  if (tiempoRestante <= 0) {
    enviarParcial();
  } else {
    tiempoRestante--;
    setTimeout(actualizarTimer, 1000);
  }
}
actualizarTimer();

// =============================
// Botón enviar
// =============================
document.getElementById("btnEnviar").addEventListener("click", enviarParcial);

async function enviarParcial() {
  const btn = document.getElementById("btnEnviar");
  btn.disabled = true;
  btn.innerText = "⏳ Enviando...";

  // capturar usuario logueado
  let usuario = null;
  try {
    usuario = JSON.parse(localStorage.getItem("usuario"));
  } catch (err) {
    usuario = null;
  }
  if (!usuario || !usuario.email) {
    alert("❌ No se encontró usuario logueado");
    window.location.href = "../auth/login.html";
    return;
  }

  // recopilar respuestas
  let respuestas = {};
  let nota = 0;
  Object.keys(correctas).forEach(q => {
    const campo = document.querySelector(`[name=${q}]`);
    const valor = campo ? campo.value.trim().toLowerCase() : "";
    respuestas[q] = valor;

    // validación básica
    if (valor && correctas[q] && valor.includes(correctas[q])) {
      nota += 10;
    }
  });

  // determinar estado
  let aprobado = nota >= 70;
  let estado = "COMPLETADO";
  if (!aprobado) {
    estado = "RECUPERATORIO"; // se maneja en backend para bloquear 24hs
  }

  const data = {
    ...parcialConfig,
    email: usuario.email,
    estado,
    nota,
    respuestas: JSON.stringify(respuestas)
  };

  try {
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data)
    });
    const result = await resp.text();

    alert(result);

    // enviar correo con respuestas
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: "enviarMail",
        to: usuario.email,
        cc: "gamma.automatizaciones@gmail.com",
        subject: "Entrega de alumno",
        body: `Alumno: ${usuario.email}\nParcial: ${parcialConfig.parcial}\nNota: ${nota}\nEstado: ${estado}\n\nRespuestas:\n${JSON.stringify(respuestas, null, 2)}`
      })
    });

    // redirigir
    window.location.href = "../modulos/modulo1.html";

  } catch (err) {
    alert("❌ Error al enviar: " + err.message);
    btn.disabled = false;
    btn.innerText = "Enviar Parcial";
  }
}
