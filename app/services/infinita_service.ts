// import env from '#start/env'

import env from '#start/env'
import axios from 'axios'

export const RegistrarTransaccion = async (
  monto: number,
  numero_cuenta: number,
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
/**
       *
       *
{
  "Messages": [
    {
      "Description": "Los datos han sido agregados.",
      "Id": "SuccessfullyAdded",
      "Type": 0
    }
  ],
  "Retorno": "OK",
  "TcMovNro": "10139"
}
       */

// return datosParaApiInfinita;
// return { numero_movimiento: "12" }
// }
// export const RevertirTransaccion = async(numero_movimiento: string | number)=>{
/* const datosParaApiInfinita = {
        "TcMovNro": numero_movimiento
      }   */

/**
       *
       *
{
  "Messages": [
    {
      "Description": "El movimiento ya se encuentra reversado",
      "Id": "ERROR",
      "Type": 0
    }
  ],
  "Retorno": "ERROR"
}
{
  "Messages": [
    {
      "Description": "El movimiento no existe",
      "Id": "ERROR",
      "Type": 0
    }
  ],
  "Retorno": "ERROR"
}
{
  "Messages": [
    {
      "Description": "Reverso con éxito.",
      "Id": "OK",
      "Type": 0
    }
  ],
  "Retorno": "OK"
}
       */

// return datosParaApiInfinita;
//  return { numero_movimiento: "12" }
// }
