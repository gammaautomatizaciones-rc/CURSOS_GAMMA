const practicoConfig = {
  action: "practico",
  practico: "TP2",
  modulo: 1
};

// =============================
// Inicializar verificación automática
// =============================
autoVerificar("q1","b","p1","Todas las fórmulas en Excel comienzan con el signo =.");
autoVerificar("q2","c","p2","El operador * se utiliza para multiplicar.");
autoVerificar("q3","a","p3","10 + 5 es igual a 15.");
autoVerificar("q4","a","p4","Las referencias permiten actualizar automáticamente los resultados.");
autoVerificar("q5","a","p5","Un error común es olvidar el signo = al inicio de la fórmula.");
autoVerificar("q6","b","p6","Para restar B1 a A1 se usa =A1-B1.");
autoVerificar("q7","a","p7","20 dividido 4 es 5.");
autoVerificar("q8","b","p8","Referirse a una celda vacía puede dar como resultado 0 o un error.");
autoVerificar("q9","b","p9","Por jerarquía de operaciones: 2*3=6, 6+4=10.");
autoVerificar("q10","b","p10","El operador para división es /.");

// =============================
// Botón final
// =============================
document.getElementById("btnEnviar").addEventListener("click", () => {
  validarYEnviar(practicoConfig);
});
