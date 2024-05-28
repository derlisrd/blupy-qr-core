import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const generarQRValidator = vine.compile(
  vine.object({
    comercio_id: vine.number(),
    monto: vine.number(),
    descripcion: vine.string(),
    condicion_venta: vine.number(),
  })
)

generarQRValidator.messagesProvider = new SimpleMessagesProvider({
  // Applicable for all fields
  'required': 'The {{ field }} field is required',
  'string': 'The value of {{ field }} field must be a string',
  'email': 'The value is not a valid email address',

  // Error message for the condicion_venta field
  'condicion_venta.required': 'Ingrese condicion_venta (Contado 1 o Credito 2)',
})

export const autorizarQRValidator = vine.compile(
  vine.object({
    id: vine.number(),
    numero_cuenta: vine.number(),
  })
)
