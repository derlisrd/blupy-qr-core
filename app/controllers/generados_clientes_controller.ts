import Generado from '#models/generado';
import { RegistrarTransaccion } from '#services/infinita_service';
import { autorizarQRValidator } from '#validators/generar';
import type { HttpContext } from '@adonisjs/core/http'

export default class GeneradosClientesController {

    async autorizarQR({request,response} : HttpContext){
        try{
            const req =  request.all()
            
            await autorizarQRValidator.validate(req)

            const generado = await Generado.find(req.id);
            if(!generado){
                return response.status(404).json({success:false,message:'QR inexistente.'})
            }

            const cincoMinutos = 5 * 60 * 1000; // 5 minutos en milisegundos
            const tiempoActual = new Date().getTime();
            const tiempoCreacion = new Date(`${generado.createdAt}`).getTime();

            if (tiempoActual - tiempoCreacion > cincoMinutos) {
                return response.status(403).json({ success: false, message: 'QR vencido.' });
            }

            if(generado.status == 1){
                return response.status(403).json({success:false,message:'QR ya autorizado'})
            }
            
            const registrarEnInfinita = await RegistrarTransaccion(generado.monto,req.numero_cuenta,generado.descripcion)
            generado.numero_movimiento = registrarEnInfinita.numero_movimiento

            generado.status = 1;
            generado.numero_cuenta = req.numero_cuenta;
            await generado.save();

            return response.json({success:true,message: 'Autorizado'})
        }
        catch(error){
            console.log(error)
            const message = error.messages[0]['message'] ?? 'Error de servidor';
            return response.status(error.status).json({success:false,message})
           
        }
    }



    

    async consultarQR({request,response} : HttpContext){
        try {
            const id =  request.param('id')
            const generado = await Generado.find(id);
           if(!generado){
            return response.status(404).json({success:false,message:'No existe qr'})
           }
            const cincoMinutos = 5 * 60 * 1000; // 5 minutos en milisegundos
            const tiempoActual = new Date().getTime();
            const tiempoCreacion = new Date(`${generado.createdAt}`).getTime();
            if (tiempoActual - tiempoCreacion > cincoMinutos) {
                return response.status(403).json({ success: false, message: 'QR vencido.' });
            }
           await generado.load('comercio')

           await generado.load('moneda')
           
           const results = {
            id: generado.id,
            comercio: generado.comercio.nombre,
            sucursal: generado.comercio.sucursal,
            descripcion: generado.descripcion,
            status: generado.status,
            monto: generado.monto,
            moneda: generado.moneda.abreviatura
           }
           
           return {success:true,results}
        } catch (error) {
            console.log(error);
            
            return response.status(500).json({success:false,error:'Error de servidor contactar con administrador'})
        }
    }


    

}