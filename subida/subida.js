// URL del Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbxigqP-YmCRTkj64ZYsbHhJEg94klfK-2p0UAIBHIhh1uAHym_fhLM6uvGf2ixA1hyA/exec"; // reemplazar por la tuya

document.getElementById("actividad-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const estado = document.getElementById("estado");
  const formData = new FormData(e.target);

  const archivo = formData.get("archivo");

  if (!archivo) {
    estado.innerText = "⚠️ Seleccioná un archivo.";
    return;
  }

  // Convertimos archivo a base64
  const base64 = await toBase64(archivo);

  // Armamos payload
  const data = {
    nombre: formData.get("nombre"),
    curso: formData.get("curso"),
    modulo: formData.get("modulo"),
    archivo: base64.split(",")[1], // sacamos el encabezado
    mimeType: archivo.type
  };

  try {
    const resp = await fetch(API_URL, {
      method: "POST",
      body: new URLSearchParams(data) // Apps Script recibe datos como formulario
    });

    if (resp.ok) {
      estado.innerText = "✅ Actividad enviada y guardada en Drive.";
      e.target.reset();
    } else {
      estado.innerText = "❌ Error al enviar la actividad.";
    }
  } catch (error) {
    console.error("Error:", error);
    estado.innerText = "⚠️ Problema de conexión.";
  }
});

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
