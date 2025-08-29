// =============================
// api.js
// =============================

// URL del Router.gs publicado como app web
const API_URL = "https://script.google.com/macros/s/AKfycbylUMmrIuT-e7-biAyKtAyvmajxrg0mv_yjIn3E4nkYRn-ZA5TpAUhKUVl-S46oEY1BBA/exec";

// =============================
// Helper genérico para llamar a la API
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
      return { success: false, msg: "⚠️ Respuesta inválida del servidor", raw: text };
    }

    return result;
  } catch (err) {
    console.error("Error de conexión:", err);
    return { success: false, msg: "⚠️ Error de conexión: " + err.message };
  }
}
