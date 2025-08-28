// =============================
// CONFIG DEL PARCIAL
// =============================
const parcialConfig = {
  action: "parcial",
  parcial: "P1",
  modulo: 1,
  curso: "excel",
  grupo: "1"
};

// =============================
// TIMER 60 MIN
// =============================
let tiempoRestante = 60 * 60; // en segundos
const timerEl = document.getElementById("timer");

function actualizarTimer() {
  let min = Math.floor(tiempoRestante / 60);
  let seg = tiempoRestante % 60;
  timerEl.textContent = `${min}:${seg.toString().padStart(2, "0")}`;
  if (tiempoRestante <= 0) {
    document.getElementById("btnEnviar").click(); // auto-envío
  } else {
    tiempoRestante--;
    setTimeout(actualizarTimer, 1000);
  }
}
actualizarTimer();

// =============================
// BOTÓN ENVIAR
// =============================
document.getElementById("btnEnviar").addEventListener("click", () => {
  validarYEnviar(parcialConfig);
});
