// =============================
// CONFIGURACIÓN GLOBAL
// =============================
const API_URL = "https://script.google.com/macros/s/AKfycbx.../exec"; // <--- tu Router.gs

// =============================
// Helper genérico para enviar POST
// =============================
async function apiCall(action, params = {}) {
  try {
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ action, ...params })
    });

    const text = await resp.text();
    let result;

    try {
      result = JSON.parse(text);
    } catch {
      console.error("Respuesta no JSON:", text);
      return { success: false, msg: "⚠️ Respuesta no válida del servidor", raw: text };
    }

    return result;
  } catch (err) {
    console.error("Error conexión:", err);
    return { success: false, msg: "⚠️ Error de conexión: " + err.message };
  }
}
