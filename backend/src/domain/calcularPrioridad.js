export const TIPOS_CLIENTE = ["VIP", "CORPORATIVO", "REGULAR"];

const FACTOR_VIP = 1.5;
const FACTOR_CORPORATIVO = 1.2;
const FACTOR_BASE = 1.0;
const CALIFICACION_MINIMA_CORPORATIVO = 3;
const BONUS_URGENCIA = 2.0;
const PRIORIDAD_MAXIMA = 10.0;

export class InvalidAtencionError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidAtencionError";
  }
}

export function normalizarTipoCliente(tipoCliente) {
  const tipo =
    typeof tipoCliente === "string" ? tipoCliente.toUpperCase() : null;
  if (!TIPOS_CLIENTE.includes(tipo)) {
    throw new InvalidAtencionError(
      `Tipo de cliente inválido (${TIPOS_CLIENTE.join(", ")})`,
    );
  }
  return tipo;
}

function validarCalificacion(calificacion) {
  if (!Number.isInteger(calificacion) || calificacion < 1 || calificacion > 5) {
    throw new InvalidAtencionError("Calificación fuera de rango (1-5)");
  }
}

function validarUrgencia(esUrgente) {
  if (typeof esUrgente !== "boolean") {
    throw new InvalidAtencionError("esUrgente debe ser booleano");
  }
}

function obtenerFactor(tipo, calificacion) {
  if (tipo === "VIP") return FACTOR_VIP;
  if (tipo === "CORPORATIVO" && calificacion >= CALIFICACION_MINIMA_CORPORATIVO)
    return FACTOR_CORPORATIVO;
  return FACTOR_BASE;
}

function redondearDosDecimales(valor) {
  return Math.round(valor * 100) / 100;
}

export function calcularPrioridad({ calificacion, esUrgente, tipoCliente }) {
  validarCalificacion(calificacion);
  validarUrgencia(esUrgente);
  const tipo = normalizarTipoCliente(tipoCliente);

  let prioridad = calificacion * obtenerFactor(tipo, calificacion);
  if (esUrgente) prioridad += BONUS_URGENCIA;

  return redondearDosDecimales(Math.min(prioridad, PRIORIDAD_MAXIMA));
}
