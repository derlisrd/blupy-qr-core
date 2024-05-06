//import env from '#start/env'

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
      MvCod: 1,
    },
  }
  const res = await axios.post(
    'https://desa.micredito.com.py/rest/api/RegistroTrn',
    datosParaApiInfinita,
    {
      headers: {
        'Authorization':
          'Bearer e9bb2db8-b754-466e-95be-192232dc7d8c!0cbe9957deef47bf62d7e357fe271ccc57b29c1cbb6ffce02d528d48d08e5dfd1d52c6a83566c5',
        'Content-Type': 'application/json',
      },
    }
  )
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

//return datosParaApiInfinita;
//return { numero_movimiento: "12" }
//}
//export const RevertirTransaccion = async(numero_movimiento: string | number)=>{
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

//return datosParaApiInfinita;
//  return { numero_movimiento: "12" }
//}
