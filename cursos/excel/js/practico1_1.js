const practicoConfig = {
  action: "practico",
  practico: "TP1",
  modulo: 1
};

// =============================
// Inicializar verificación automática
// =============================
autoVerificar("q1","c","p1","Una celda es la intersección entre una fila y una columna, por ejemplo A1.");
autoVerificar("q2","b","p2","Cada celda se identifica por su columna (letra) y fila (número), ej: B2.");
autoVerificar("q3","a","p3","Ctrl + Flecha te mueve al final o inicio de los datos en una fila o columna.");
autoVerificar("q4","a","p4","El libro es el archivo de Excel (.xlsx) y dentro contiene hojas (pestañas).");
autoVerificar("q5","b","p5","Si la celda de al lado está libre, Excel muestra el texto expandido.");
autoVerificar("q6","b","p6","El atajo estándar para guardar es Ctrl + S.");
autoVerificar("q7","a","p7","Una fila se selecciona desde el número al inicio de esa fila.");
autoVerificar("q8","c","p8","Ctrl + Z sirve para deshacer la última acción.");
autoVerificar("q9","a","p9","La barra de fórmulas muestra y permite editar el contenido de la celda.");
autoVerificar("q10","b","p10","Desde Excel 2007 la extensión por defecto es .xlsx.");

// =============================
// Botón final
// =============================
document.getElementById("btnEnviar").addEventListener("click", () => {
  validarYEnviar(practicoConfig);
});
