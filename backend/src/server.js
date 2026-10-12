import express from "express";
import { atencionesRouter } from "./routes/atenciones.js";
import { InvalidAtencionError } from "./domain/calcularPrioridad.js";

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use("/api/atenciones", atencionesRouter);

app.use((err, req, res, next) => {
  if (err instanceof InvalidAtencionError) {
    return res.status(400).json({ error: err.message });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "JSON inválido" });
  }
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
