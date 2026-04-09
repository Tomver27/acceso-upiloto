import { SerialPort, ReadlineParser } from 'serialport'

// ── Configuración ──────────────────────────────────────
const SERIAL_PATH = process.env.SERIAL_PATH || '/dev/ttyUSB0'
const BAUD_RATE   = Number(process.env.BAUD_RATE) || 9600
const API_URL     = process.env.API_URL || 'http://localhost:3000/api/access'

// ── Puerto serial ──────────────────────────────────────
const port = new SerialPort({ path: SERIAL_PATH, baudRate: BAUD_RATE })
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))

port.on('open', () => {
  console.log(`[bridge] Puerto serial abierto: ${SERIAL_PATH} @ ${BAUD_RATE}`)
})

port.on('error', (err) => {
  console.error('[bridge] Error en puerto serial:', err.message)
})

// ── Procesar datos del Arduino ─────────────────────────
// Formato esperado: "cardUuid,labId\n"
// Ejemplo:          "4606f460,1\n"
parser.on('data', async (raw) => {
  const line = raw.toString().trim()
  if (!line) return

  const [cardUuid, labIdStr] = line.split(',')
  const idLab = Number(labIdStr)

  if (!cardUuid || Number.isNaN(idLab)) {
    console.error(`[bridge] Formato inválido: "${line}" — esperado: cardUuid,labId`)
    port.write('0\n')
    return
  }

  console.log(`[bridge] Tarjeta: ${cardUuid} | Lab: ${idLab}`)

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardUuid, idLab }),
    })

    const data = await res.json()

    if (data.granted) {
      console.log(`[bridge] ✓ Acceso concedido — ${data.user?.firstName ?? ''} ${data.user?.lastName ?? ''}`)
      port.write('1\n')
    } else {
      console.log(`[bridge] ✗ Acceso denegado — ${data.reason}`)
      port.write('0\n')
    }
  } catch (err) {
    console.error('[bridge] Error al consultar API:', err.message)
    port.write('0\n')
  }
})
