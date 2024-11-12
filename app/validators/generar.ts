import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const generarQRValidator = vine.compile(
  vine.object({
    comercio_id: vine.number(),
    monto: vine.number(),
    descripcion: vine.string(),
    condicion_venta: vine.number()
  })
)

generarQRValidator.messagesProvider = new SimpleMessagesProvider({
  // Applicable for all fields
  required: 'El campo {{ field }} es obligatorio',
  string: 'El valor de {{ field }} debe ser string',
  email: 'El {{ field }} debe ser un email',

  // Error message for the condicion_venta field
  'condicion_venta.required': 'Ingrese condicion_venta (Contado 1 o Credito 2)'
})

export const autorizarQRValidator = vine.compile(
  vine.object({
    id: vine.number(),
    numero_cuenta: vine.number()
  })
)
