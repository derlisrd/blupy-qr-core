import Generado from '#models/generado'
import type { HttpContext } from '@adonisjs/core/http'

export default class GeneradosController {

    async generarQR({request,response} : HttpContext){
        try {
            const req = request.only(['monto','descripcion','comercio_id','moneda_id'])
            const idMoneda = req.moneda_id ?? 1;

           const generado =  await Generado.create({
                monto: req.monto, 
                descripcion: req.descripcion, 
                comercio_id: req.comercio_id, 
                moneda_id:idMoneda
            })
           
           await generado.load('moneda')
           await generado.load('comercio')

            return response.json({
                success:true,
                results: {
                    monto: generado.monto,
                    descripcion: generado.descripcion,
                    id: generado.id,
                    moneda: generado.moneda.abreviatura,
                    comercio: generado.comercio.nombre
                }
            })
        } catch (error) {    
            console.log(error);
              
            return response.status(500).json({success:false,error:'Error de servidor contactar con administrador'})
        }
    }





    async consultarAutorizacion({request,response} : HttpContext){
        try{
           const id =  request.param('id')
           const generado = await Generado.find(id);
           if(!generado){
            return response.json({success:false,message:'No autorizado'})
           }
            const cincoMinutos = 5 * 60 * 1000; // 5 minutos en milisegundos
            const tiempoActual = new Date().getTime();
            const tiempoCreacion = new Date(`${generado.createdAt}`).getTime();

            if (tiempoActual - tiempoCreacion > cincoMinutos) {
                return response.status(403).json({ success: false, message: 'QR vencido. Debe generar otro' });
            }

            if(generado.status == 0){
                return response.status(403).json({ success: false, message: 'QR aun no autorizado' });
            }

           return response.json({success:true, message:'QR autorizado'})
        } catch (error) {
            return response.status(500).json({success:false,error:'Error de servidor contactar con administrador'})
        }
    }




    async autorizarQR({request,response} : HttpContext){
        try{
            const req =  request.only(['id','numero_cuenta'])
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
            
            generado.status = 1;
            generado.numero_cuenta = req.numero_cuenta;
            await generado.save();

            return response.json({success:true,message: 'Autorizado'})
        }
        catch(error){
            return response.status(500).json({success:false,error:'Error de servidor contactar con administrador'})
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