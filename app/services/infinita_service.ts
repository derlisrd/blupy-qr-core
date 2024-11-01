// import env from '#start/env'

import env from '#start/env'
import axios from 'axios'

export const RegistrarTransaccion = async (
  monto: number,
  numero_cuenta: number,
  descripcion: string,
  numero_tarjeta: number
) => {
  const datosParaApiInfinita = {
    Transaccion: {
      MaeCtaId: String(numero_cuenta),
      MTNume: numero_tarjeta,
      TcMovImp: monto,
      TcMovDes: descripcion,
      TcPlanId: 1,
      TcComId: 1,
      TcMovCuC: 1,
      MvCod: 1
    }
  }
  const res = await axios.post(`${env.get('INFINITA_URL_API')}/RegistroTrn`, datosParaApiInfinita, {
    headers: {
      Authorization: env.get('AUTH_INFINITA'),
      'Content-Type': 'application/json'
    }
  })
  return res
}
export const RevertirTransaccion = async (
  monto: number,
  numero_cuenta: number | string,
  descripcion: string
) => {
  const datosParaApiInfinita = {
    Transaccion: {
      MaeCtaId: String(numero_cuenta),
      MTNume: 1,
      TcMovImp: monto,
      TcMovDes: descripcion,
      TcPlanId: 1,
      TcComId: 1,
      TcMovCuC: 1,
      MvCod: 81
    }
  }
  const res = await axios.post(`${env.get('INFINITA_URL_API')}/RegistroTrn`, datosParaApiInfinita, {
    headers: {
      Authorization: env.get('AUTH_INFINITA'),
      'Content-Type': 'application/json'
    }
  })
  return res
}
export const ListarTarjetasPorDoc = async (documento: string) => {
  const res = await axios.get(`${env.get('INFINITA_URL_API')}/ListarTarjetasPorDoc?Mtdocu=${documento}`, {
    headers: {
      Authorization: env.get('AUTH_INFINITA'),
      'Content-Type': 'application/json'
    }
  })
  return res
}
