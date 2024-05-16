import vine from '@vinejs/vine'

export const generarQRValidator = vine.compile(
  vine.object({
    comercio_id: vine.number(),
    monto: vine.number(),
    descripcion: vine.string(),
  })
)

export const autorizarQRValidator = vine.compile(
  vine.object({
    id: vine.string() || vine.number,
    numero_cuenta: vine.number(),
  })
)
