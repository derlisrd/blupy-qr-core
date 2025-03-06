import QRCode from 'qrcode'
import Comercio from '#models/comercio'
import Generado from '#models/generado'
import Moneda from '#models/moneda'
import GeneradoAuditoria from '#models/generados_auditoria'
import { generarQRValidator } from '#validators/generar'
import { errors } from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'
import { RevertirTransaccion } from '#services/infinita_service'
import logger from '#services/logger'

export default class GeneradosComerciosController {

  async consultarAutorizacionPorCodigo({ request, response }: HttpContext) {
    const codigo = request.param('codigo')
    const generado = await Generado.findBy({ codigo })
    if (generado == null) {
      return response.status(404).json({ success: false, message: 'No autorizado' })
    }

    if (generado.status === 0) {
      return response.status(403).json({ success: false, message: 'QR aun no autorizado' })
    }
    return response.json({
      success: true,
      results: generado
    })
  }

  async generarQR({ request, response }: HttpContext) {
    try {
      const data = request.all()
      await generarQRValidator.validate(data)
      const req = request.only([
        'monto',
        'descripcion',
        'appel_codigo',
        'documento',
        'detalle',
        'condicion_venta',
        'comercio_id',
        'adicional',
        'moneda_id',
        'numero_movimiento',
        'numero_comprobante',
        'web',
        'farma'
      ])
      const idMoneda = req.moneda_id ?? 1
      const monedaFind = await Moneda.find(idMoneda)
      if (monedaFind == null) {
        return response.status(404).json({ success: false, message: 'No existe id de moneda' })
      }
      const comercioFind = await Comercio.find(req.comercio_id)

      if (comercioFind == null) {
        return response.status(404).json({ success: false, message: 'ID de comercio no valido' })
      }
      const codigo = ''

      const generado = await Generado.create({
        monto: req.monto,
        web: req.web,
        documento: req.documento,
        appel_codigo: req.appel_codigo,
        descripcion: req.descripcion,
        comercio_id: req.comercio_id,
        condicion_venta: req.condicion_venta,
        detalle: req.detalle,
        adicional: req.adicional,
        moneda_id: idMoneda,
        numero_movimiento: req.numero_movimiento,
        numero_comprobante: req.numero_comprobante,
        farma: req.farma,
        codigo
      })

      await GeneradoAuditoria.create({
        generado_id: generado.id,
        status: 'GENERADO'
      })

      await generado.load('moneda')
      await generado.load('comercio')
      const base64 = await QRCode.toDataURL(String(generado.id),{ width: 256, margin: 2 })
      return response.json({
        success: true,
        results: {
          id: generado.id,
          codigo: generado.codigo,
          appel_codigo: generado.appel_codigo,
          web: generado.web,
          farma: generado.farma,
          imageUrl: 'https://quickchart.io/qr?text=' + generado.id,
          documento: generado.documento,
          monto: generado.monto,
          descripcion: generado.descripcion,
          detalle: generado.detalle,
          condicionVenta: generado.condicion_venta,
          condicion_venta: generado.condicion_venta,
          condicion: generado.condicion_venta === 1 ? 'Contado' : 'Credito',
          moneda: generado.moneda.abreviatura,
          comercio: generado.comercio.nombre,
          sucursal: generado.comercio.sucursal,
          numero_comprobante: generado.numero_comprobante,
          numero_movimiento: generado.numero_movimiento,
          fecha: generado.createdAt,
          base64
        }
      })
    } catch (error) {
      logger.info(String(error))
      let message = 'Error de servidor'
      if (error instanceof errors.E_VALIDATION_ERROR) {
        // array created by SimpleErrorReporter
        message = error.messages[0].message
      }
      return response.status(500).json({ success: false, message })
    }
  }



  async consultarAutorizacion({ request, response }: HttpContext) {
    try {
      const id = request.param('id')
      const generado = await Generado.find(id)
      if (generado == null) {
        return response.status(404).json({ success: false, message: 'No autorizado' })
      }

      if (generado.status === 0) {
        return response.status(403).json({ success: false, message: 'QR aun no autorizado' })
      }
      await generado.load('moneda')

      const results = {
        id: generado.id,
        codigo: generado.codigo,
        documento: generado.documento,
        numero_cuenta: generado.numero_cuenta,
        MTNume: generado.numero_tarjeta,
        numero_tarjeta: generado.numero_tarjeta,
        monto: generado.monto,
        numero_movimiento: generado.numero_movimiento,
        moneda: generado.moneda.abreviatura,
        cuotas: generado.cuotas,
        descripcion: generado.descripcion,
        condicion_venta: generado.condicion_venta,
        fecha: generado.createdAt,
        adicional: generado.adicional,
        appel_codigo: generado.appel_codigo
      }
      return response.json({ success: true, message: 'Autorizado', results })
    } catch (error) {
      console.log(error)
      logger.info(String(error))
      logger.info(JSON.stringify(error))
      return response
        .status(500)
        .json({ success: false, error: 'Error de servidor contactar con administrador' })
    }
  }

  async actualizarMovimiento({ request, response }: HttpContext) {
    try {
      const req = request.only(['id','detalle','numero_comprobante','adicional','comercio_id'])
      const generado = await Generado.find(req.id)
      if (generado == null) {
        return response.status(400).json({ success: false, message: 'No existe movimiento' })
      }
      if (generado.status === 0) {
        return response.status(400).json({ success: false, message: 'Movimiento no autorizado por el cliente.' })
      }
      if (generado.comercio_id !== req.comercio_id) {
        return response.status(400).json({ success: false, message: 'Comercio no corresponde al movimiento.' })
      }
      generado.numero_comprobante = req.numero_comprobante
      generado.detalle = req.detalle
      generado.adicional = req.adicional
      generado.save()
      return response.json({ success: true, message: 'Movimiento actualizado' })
    } catch (error) {
      console.log(error)
      return response.status(500).json({ success: false, message: 'Error en el servidor' })
    }
  }

  async anular({ request, response }: HttpContext) {
    try {
      // const id = request.param('id')
      const { id } = request.only(['id'])
      const generado = await Generado.find(id)
      const auditoria = await GeneradoAuditoria.findByOrFail('generado_id',id)
      if (generado == null) {
        return response.status(404).json({ success: false, message: 'QR inexistente.' })
      }

      if(generado.status === 1 && generado.condicion_venta === 1 && generado.numero_cuenta !== '0' && generado.numero_movimiento !== null) {
        auditoria.status = 'ANULADO'
        generado.status = 2
        const res = await RevertirTransaccion(
          generado.monto,
          generado.numero_cuenta,
          'Reversión de mov. ' + generado.numero_movimiento
        )
        if (res.data.Retorno === 'ERROR' || res.status !== 200) {
          return response
            .status(400)
            .json({ success: false, message: 'Ocurrio un error al anular y retornar.' })
        }
        await auditoria.save()
        await generado.save()
        return response.status(400).json({ success: true, message: 'QR anulado y revertido.', results: generado })
      }

      auditoria.status = 'ANULADO'
      generado.status = 2
      await auditoria.save()
      await generado.save()

      return response.json({ success: true, message: 'QR anulada', results: generado })
    } catch (error) {
      console.log(error)
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
      const auditoria = await GeneradoAuditoria.findByOrFail('generado_id',id)
      if (generado == null) {
        return response.status(404).json({ success: false, message: 'No autorizado' })
      }

      if (generado.status === 0) {
        return response.status(403).json({ success: false, message: 'QR aun no autorizado' })
      }

      if (generado.status > 2) {
        return response
          .status(403)
          .json({ success: false, message: 'Operacion ya ha sido revertida' })
      }

      if (generado.status === 1 && generado.numero_cuenta !== '0'  && generado.numero_movimiento !== null) {
        const res = await RevertirTransaccion(
          generado.monto,
          generado.numero_cuenta,
          'Reversion de mov. ' + generado.numero_movimiento
        )
        if (res.data.Retorno === 'ERROR' || res.status !== 200) {
          return response
            .status(400)
            .json({ success: false, message: 'Ocurrio un error al revertir' })
        }
      }

      generado.status = 3
      auditoria.status = 'REVERTIDO'
      await auditoria.save()
      await generado.save()

      return response.json({ success: true, message: 'Operacion revertida ', results : {id} })
    } catch (error) {
      console.log(error)
      return response
        .status(500)
        .json({ success: false, error: 'Error de servidor contactar con administrador' })
    }
  }
}
