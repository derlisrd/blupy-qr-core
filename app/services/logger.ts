import { createLogger, format, transports } from 'winston'

// Configuración del logger
const logger = createLogger({
  level: 'info', // Nivel de log ('info', 'warn', 'error', etc.)
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`
    })
  ),
  transports: [
    new transports.Console(), // Log en consola
    new transports.File({ filename: 'logs/app.log' }) // Log en archivo
  ]
})

export default logger
