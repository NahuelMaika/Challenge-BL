import { Router } from "express";
import {
  calcularPrioridad,
  normalizarTipoCliente,
} from "../domain/calcularPrioridad.js";
import { insertarAtencion } from "../repositories/atencionRepository.js";

export const atencionesRouter = Router();

atencionesRouter.post("/", async (req, res) => {
  const { calificacion, esUrgente, tipoCliente } = req.body ?? {};

  const prioridad = calcularPrioridad({ calificacion, esUrgente, tipoCliente });
  const atencion = {
    calificacion,
    esUrgente,
    tipoCliente: normalizarTipoCliente(tipoCliente),
    prioridad,
  };

  const id = await insertarAtencion(atencion);
  res.status(201).json({ id, ...atencion });
});
