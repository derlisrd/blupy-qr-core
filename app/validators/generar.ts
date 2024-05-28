import vine from '@vinejs/vine'

export const generarQRValidator = vine.compile(
  vine.object({
    comercio_id: vine.number(),
    monto: vine.number(),
    descripcion: vine.string(),
    condicion_venta: vine.number(),
  })
)

export const autorizarQRValidator = vine.compile(
  vine.object({
    id: vine.number(),
    numero_cuenta: vine.number(),
  })
)
