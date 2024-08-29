import Generado from '#models/generado'
import GeneradoAuditoria from '#models/generados_auditoria'
import { ListarTarjetasPorDoc, RegistrarTransaccion } from '#services/infinita_service'
import { LOG } from '#services/supabase_service'

import { autorizarQRValidator } from '#validators/generar'
import type { HttpContext } from '@adonisjs/core/http'

export default class GeneradosClientesController {
  async autorizarQR({ request, response }: HttpContext) {
    try {
      const req = request.all()

      await autorizarQRValidator.validate(req)

      const generado = await Generado.find(req.id)

      if (generado?.documento !== req.documento && generado?.numero_cuenta === '0') {
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
        const res = await ListarTarjetasPorDoc(generado.documento)
        const saldoAdeudado = res.data.Tarjetas[0].MTSaldo as string
        const saldoDisponible = res.data.Tarjetas[0].MTLinea as string
        const disponible = parseInt(saldoDisponible) - parseInt(saldoAdeudado)
        if (disponible < generado.monto) {
          return response
            .status(400)
            .json({ success: false, message: 'No hay saldo suficiente en tu linea.' })
        }
      }

      const cincoMinutos = 5 * 60 * 1000 // 5 minutos en milisegundos
      const tiempoActual = new Date().getTime()
      const tiempoCreacion = new Date(`${generado.createdAt}`).getTime()

      if (tiempoActual - tiempoCreacion > cincoMinutos) {
        return response.status(403).json({ success: false, message: 'QR vencido.' })
      }

      if (generado.status === 1) {
        return response.status(403).json({ success: false, message: 'QR ya autorizado' })
      }
      if (generado.status === 2) {
        return response.status(403).json({ success: false, message: 'QR anulado.' })
      }

      let TcMovNro = ''
      // esto realizar si es externo
      if (req.numero_cuenta > 0) {
        const res = await RegistrarTransaccion(
          generado.monto,
          req.numero_cuenta,
          generado.descripcion
        )
        if (res.data.Retorno === 'ERROR' || res.status !== 200) {
          return response
            .status(400)
            .json({ success: false, message: 'Ocurrio un error al autorizar' })
        }
        TcMovNro = res.data.TcMovNro
      }

      generado.status = 1
      generado.numero_movimiento = TcMovNro
      generado.numero_cuenta = req.numero_cuenta
      await generado.save()

      auditoria.telefono = req.telefono
      auditoria.localizacion = req.localizacion
      auditoria.ip_user = req.ip
      auditoria.status = 'AUTORIZADO'
      await auditoria.save()

      await generado.load('moneda')
      await generado.load('comercio')

      const results = {
        monto: generado.monto,
        descripcion: generado.descripcion,
        moneda: generado.moneda.abreviatura,
        id: generado.id,
        fecha: generado.createdAt,
        comercio: generado.comercio.nombre,
        numero_movimiento: TcMovNro,
        numero_cuenta: req.numero_cuenta
      }
      // console.log('result', results)
      return response.json({ success: true, message: 'Autorizado', results })
    } catch (error) {
      console.log(error)
      await LOG('Erro_QR_autorizar',error)
      // const message = error.messages[0].message ?? 'Error de servidor'
      return response.status(500).json({ success: false, message: 'Error de servidor' })
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
}
