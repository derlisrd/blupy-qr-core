import env from '#start/env'


export const RegistrarTransaccion = async(monto : number,numero_cuenta: number,descripcion: string)=>{
    const datosParaApiInfinita = {
        "Transaccion":{
            "MaeCtaId": numero_cuenta,
            "TcMovImp": monto,
            "TcMovDes": descripcion,
            "TcPlanId": 1,
            "TcComId":  1,
            "TcMovCuC": 1
        }
    }

    //return datosParaApiInfinita;
    return { numero_movimiento: "12" }
}