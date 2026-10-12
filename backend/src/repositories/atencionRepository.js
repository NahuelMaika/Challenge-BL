import { pool } from "../db/pool.js";

const INSERT_ATENCION = `
  INSERT INTO atenciones_orbital (calificacion, es_urgente, tipo_cliente, prioridad)
  VALUES (?, ?, ?, ?)
`;

export async function insertarAtencion({ calificacion, esUrgente, tipoCliente, prioridad }) {
  // execute() uses a server-side prepared statement: values never get concatenated into the SQL.
  const [result] = await pool.execute(INSERT_ATENCION, [
    calificacion,
    esUrgente,
    tipoCliente,
    prioridad,
  ]);
  return result.insertId;
}
