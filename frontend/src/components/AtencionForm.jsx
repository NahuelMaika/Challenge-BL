import { useState } from 'react'

const TIPOS_CLIENTE = ['REGULAR', 'CORPORATIVO', 'VIP']
const CALIFICACIONES = [1, 2, 3, 4, 5]

const FORM_INICIAL = { calificacion: 3, esUrgente: false, tipoCliente: 'REGULAR' }

async function registrarAtencion(atencion) {
  const response = await fetch('/api/atenciones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(atencion),
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.error ?? `Error ${response.status}`)
  }
  return data
}

export default function AtencionForm() {
  const [form, setForm] = useState(FORM_INICIAL)
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const actualizar = (campo, valor) => setForm((prev) => ({ ...prev, [campo]: valor }))

  async function handleSubmit(event) {
    event.preventDefault()
    setEnviando(true)
    setError(null)
    setResultado(null)
    try {
      setResultado(await registrarAtencion(form))
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="atencion-form">
      <h1>Registrar atención</h1>

      <label>
        Calificación
        <select
          value={form.calificacion}
          onChange={(e) => actualizar('calificacion', Number(e.target.value))}
        >
          {CALIFICACIONES.map((valor) => (
            <option key={valor} value={valor}>{valor}</option>
          ))}
        </select>
      </label>

      <label>
        Tipo de cliente
        <select
          value={form.tipoCliente}
          onChange={(e) => actualizar('tipoCliente', e.target.value)}
        >
          {TIPOS_CLIENTE.map((tipo) => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
      </label>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={form.esUrgente}
          onChange={(e) => actualizar('esUrgente', e.target.checked)}
        />
        Urgente
      </label>

      <button type="submit" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Registrar'}
      </button>

      {resultado && (
        <p className="resultado" role="status">
          Atención #{resultado.id} registrada con prioridad <strong>{resultado.prioridad}</strong>
        </p>
      )}
      {error && <p className="error" role="alert">{error}</p>}
    </form>
  )
}
