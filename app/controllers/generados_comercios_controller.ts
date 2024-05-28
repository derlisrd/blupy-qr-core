import Comercio from '#models/comercio'
import Generado from '#models/generado'
import Moneda from '#models/moneda'
import { generarQRValidator } from '#validators/generar'
import { errors } from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'

export default class GeneradosComerciosController {
  async generarQR({ request, response }: HttpContext) {
    try {
      const data = request.all()
      await generarQRValidator.validate(data)
      const req = request.only([
        'monto',
        'descripcion',
        'detalle',
        'condicion_venta',
        'comercio_id',
        'adicional',
        'moneda_id',
        'numero_movimiento',
      ])
      const idMoneda = req.moneda_id ?? 1
      const monedaFind = await Moneda.find(idMoneda)
      if (!monedaFind) {
        return response.status(404).json({ success: false, message: 'No existe id de moneda' })
      }

      const comercioFind = await Comercio.find(req.comercio_id)

      if (!comercioFind) {
        return response.status(404).json({ success: false, message: 'ID de comercio no valido' })
      }

      const generado = await Generado.create({
        monto: req.monto,
        descripcion: req.descripcion,
        comercio_id: req.comercio_id,
        condicion_venta: req.condicion_venta,
        detalle: req.detalle,
        adicional: req.adicional,
        moneda_id: idMoneda,
        numero_movimiento: req.numero_movimiento,
      })

      await generado.load('moneda')
      await generado.load('comercio')

      return response.json({
        success: true,
        results: {
          id: generado.id,
          monto: generado.monto,
          descripcion: generado.descripcion,
          detalle: generado.detalle,
          condicion_venta: generado.condicion_venta,
          condicion: generado.condicion_venta === 1 ? 'Contado' : 'Credito',
          moneda: generado.moneda.abreviatura,
          comercio: generado.comercio.nombre,
          sucursal: generado.comercio.sucursal,
          numero_movimiento: generado.numero_movimiento,
          fecha: generado.createdAt,
        },
      })
    } catch (error) {
      console.log(error)
      let message = 'Error de servidor'
      if (error instanceof errors.E_VALIDATION_ERROR) {
        // array created by SimpleErrorReporter
        message = error.messages[0].message
      }
      return response.status(error.status).json({ success: false, message })
    }
  }

  async consultarAutorizacion({ request, response }: HttpContext) {
    try {
      const id = request.param('id')
      const generado = await Generado.find(id)
      if (!generado) {
        return response.status(404).json({ success: false, message: 'No autorizado' })
      }
      /* const cincoMinutos = 5 * 60 * 1000
      const tiempoActual = new Date().getTime()
      const tiempoCreacion = new Date(`${generado.createdAt}`).getTime()

      if (tiempoActual - tiempoCreacion > cincoMinutos) {
        return response
          .status(403)
          .json({ success: false, message: 'QR vencido. Debe generar otro' })
      } */

      if (generado.status === 0) {
        return response.status(403).json({ success: false, message: 'QR aun no autorizado' })
      }
      await generado.load('moneda')

      const results = {
        id: generado.id,
        numero_cuenta: generado.numero_cuenta,
        monto: generado.monto,
        numero_movimiento: generado.numero_movimiento,
        moneda: generado.moneda.abreviatura,
        cuotas: generado.cuotas,
        descripcion: generado.descripcion,
        condicion_venta: generado.condicion_venta,
        fecha: generado.createdAt,
        adicional: generado.adicional,
      }
      return response.json({ success: true, message: 'Autorizado', results })
    } catch (error) {
      return response
        .status(500)
        .json({ success: false, error: 'Error de servidor contactar con administrador' })
    }
  }
  /* revertir pago  */
  async revertirPago({ request, response }: HttpContext) {
    try {
      const { id } = request.only(['id'])
      const generado = await Generado.find(id)
      if (!generado) {
        return response.status(404).json({ success: false, message: 'No autorizado' })
      }

      if (generado.status === 0) {
        return response.status(403).json({ success: false, message: 'QR aun no autorizado' })
      }

      if (generado.status > 1) {
        return response
          .status(403)
          .json({ success: false, message: 'Operacion ya ha sido revertida' })
      }

      generado.status = 2
      await generado.save()

      const results = { id }
      return response.json({ success: true, message: 'Operacion revertida ', results })
    } catch (error) {
      console.log(error)
      return response
        .status(500)
        .json({ success: false, error: 'Error de servidor contactar con administrador' })
    }
  }
}
