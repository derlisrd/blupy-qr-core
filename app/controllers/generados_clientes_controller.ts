import Generado from '#models/generado'
import GeneradoAuditoria from '#models/generados_auditoria'
import { ConfirmarPago } from '#services/farma_service'
import { /* ListarTarjetasPorDoc, */ RegistrarTransaccion } from '#services/infinita_service'
import logger from '@adonisjs/core/services/logger'
import { autorizarQRValidator } from '#validators/generar'
import type { HttpContext } from '@adonisjs/core/http'

export default class GeneradosClientesController {
  async autorizarQR({ request, response }: HttpContext) {
    try {
      const req = request.all()
      await autorizarQRValidator.validate(req)

      const generado = await Generado.find(req.id)

      if(generado && generado.status === 1){
        return response.status(400).json({
          success: false,
          message: 'Ya has autorizado esta compra.'
        })
      }


      if (generado && generado.documento !== req.documento && req.extranjero === 0) {
        return response
          .status(401)
          .json({ success: false, message: 'Tu cuenta no coincide con la cédula del QR generado.' })
      }

      const auditoria = await GeneradoAuditoria.findByOrFail('generado_id', req.id)

      if (generado == null) {
        return response.status(404).json({ success: false, message: 'QR inexistente.' })
      }

      // si es credito digital controla su saldo
      if (generado.condicion_venta === 1) {
        /* const res = await ListarTarjetasPorDoc(generado.documento)
        const saldoAdeudado = res.data.Tarjetas[0].MTSaldo as string
        const saldoDisponible = res.data.Tarjetas[0].MTLinea as string
        const disponible = parseInt(saldoDisponible) - parseInt(saldoAdeudado)
        if (disponible < generado.monto) {
          return response
            .status(400)
            .json({ success: false, message: 'No hay saldo suficiente en tu linea.' })
        } */
      }

      const cincoMinutos = 5 * 60 * 1000 // 5 minutos en milisegundos
      const tiempoActual = new Date().getTime()
      const tiempoCreacion = new Date(`${generado.createdAt}`).getTime()

      if (tiempoActual - tiempoCreacion > cincoMinutos) {
        return response.status(403).json({ success: false, message: 'QR vencido.' })
      }


      if (generado.status === 2) {
        return response.status(403).json({ success: false, message: 'QR anulado.' })
      }

      let TcMovNro = ''
      // esto realizar si es externo
      if (generado.condicion_venta === 1) {
        const res = await RegistrarTransaccion(
          generado.monto,
          req.numero_cuenta,
          generado.descripcion,
          req.numero_tarjeta
        )
        // logger.info(JSON.stringify(res))
        if (res.data.Retorno === 'ERROR' || res.status !== 200) {
          const message = (res.data.Messages[0].Description)
          return response
            .status(400)
            .json({ success: false, message: message + '. QC601. Comunicate con nosotros.' })
        }
        TcMovNro = res.data.TcMovNro
      }

      generado.status = 1
      generado.numero_movimiento = TcMovNro
      generado.numero_cuenta = req.numero_cuenta
      generado.adicional = req.adicional
      generado.numero_tarjeta = req.numero_tarjeta ?? 1
      await generado.save()

      auditoria.telefono = req.telefono
      auditoria.localizacion = req.localizacion
      auditoria.ip_user = req.ip
      auditoria.status = 'AUTORIZADO'
      await auditoria.save()

      await generado.load('moneda')
      await generado.load('comercio')

      const results = {
        id: generado.id,
        codigo: generado.codigo,
        cuotas: generado.cuotas,
        monto: generado.monto,
        numero_cuenta: req.numero_cuenta,
        MTNume: generado.numero_tarjeta,
        numero_tarjeta: generado.numero_tarjeta,
        documento: generado.documento,
        condicion_venta: generado.condicion_venta,
        descripcion: generado.descripcion,
        moneda: generado.moneda.abreviatura,
        fecha: generado.createdAt,
        comercio: generado.comercio.nombre,
        numero_movimiento: TcMovNro,
        info: generado.descripcion + ' ' + generado.detalle,
        adicional: generado.adicional === null ? null : String(generado.adicional),
        appel_codigo: generado.appel_codigo,
        farma: generado.farma,
        web: generado.web
      }
      const respuesta = { success: true, message: 'Autorizado', results }
      // confirmar pago con farma
      if (generado.web) {
        await ConfirmarPago(respuesta)
      }

      return response.json(respuesta)
    } catch (error) {
      console.log(error)
      logger.error({ err: error }, 'Something went wrong')
      // const message = error.messages[0].message ?? 'Error de servidor'
      return response.status(500).json({ success: false, message: 'Error de servidor. BQ501' })
    }
  }

  async consultarQR({ request, response }: HttpContext) {
    try {
      const id = request.param('id')
      const generado = await Generado.find(id)

      if (generado == null) {
        return response.status(404).json({ success: false, message: 'No existe qr' })
      }
      if (generado.status === 1) {
        return response.status(403).json({ success: false, message: 'QR inválido' })
      }
      const cincoMinutos = 5 * 60 * 1000 // 5 minutos en milisegundos
      const tiempoActual = new Date().getTime()
      const tiempoCreacion = new Date(`${generado.createdAt}`).getTime()
      if (tiempoActual - tiempoCreacion > cincoMinutos) {
        return response.status(403).json({ success: false, message: 'QR vencido.' })
      }
      await generado.load('comercio')

      await generado.load('moneda')

      const results = {
        id: generado.id,
        comercio: generado.comercio.nombre,
        sucursal: generado.comercio.sucursal,
        descripcion: generado.descripcion,
        condicion: generado.condicion_venta,
        status: generado.status,
        monto: generado.monto,
        farma: generado.farma,
        moneda: generado.moneda.abreviatura
      }

      return { success: true, results }
    } catch (error) {
      console.log(error)

      return response
        .status(500)
        .json({ success: false, error: 'Error de servidor contactar con administrador' })
    }
  }


  async consultarQrDocumento({ request, response }: HttpContext) {
    try {
      const documento = request.param('documento')
      const generado = await Generado.query()
      .where('documento', documento)
      .where('status', 0)
      .orderBy('created_at', 'desc')
      .first()

      if (generado == null) {
        return response.status(404).json({ success: false, message: 'No existe qr', results: null })
      }
      const cincoMinutos = 5 * 60 * 1000 // 5 minutos en milisegundos
      const tiempoActual = new Date().getTime()
      const tiempoCreacion = new Date(`${generado.createdAt}`).getTime()
      if (tiempoActual - tiempoCreacion > cincoMinutos) {
        return response.status(403).json({ success: false, message: 'Ultimo QR generado ha vencido.', results: null })
      }
      await generado.load('comercio')
      await generado.load('moneda')

        const results = {
          id: generado.id,
          comercio: generado.comercio.nombre,
          moneda : generado.moneda.abreviatura,
          descripcion: generado.descripcion,
          detalle: generado.detalle,
          condicion: generado.condicion_venta,
          status: generado.status,
          monto: generado.monto,
          farma: generado.farma,
          web: generado.web,
        }


      return { success: true, results, message: '' }
    } catch (error) {
      console.log(error)

      return response
        .status(500)
        .json({ success: false, error: 'Error de servidor contactar con administrador' })
    }
  }
}
