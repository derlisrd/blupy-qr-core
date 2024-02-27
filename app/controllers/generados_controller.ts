import Generado from '#models/generado'
import type { HttpContext } from '@adonisjs/core/http'

export default class GeneradosController {

    async generarQR({request,response} : HttpContext){
        try {
            const req = request.only(['monto','descripcion','comercio_id'])

           const generado =  await Generado.create({monto: req.monto, descripcion: req.descripcion, comercio_id: req.comercio_id});

            return response.json({
                success:true,
                results: generado
            })
        } catch (error) {
            return response.status(500).json({success:false,error:'Error de servidor contactar con administrador'})
        }
    }





    async consultarAutorizacion({request,response} : HttpContext){
        try{
           const id =  request.param('id')
           const generado = await Generado.query().where('id',id).where('status',1).first()
           if(!generado){
            return response.json({success:false,message:'No autorizado'})
           }
            const tresMinutos = 5 * 60 * 1000; // 5 minutos en milisegundos
            const tiempoActual = new Date().getTime();
            const tiempoCreacion = new Date(`${generado.createdAt}`).getTime();

            if (tiempoActual - tiempoCreacion > tresMinutos) {
                return response.status(403).json({ success: false, message: 'QR vencido. Debe generar otro' });
            }

           return response.json({success:true, results: generado})
        } catch (error) {
            return response.status(500).json({success:false,error:'Error de servidor contactar con administrador'})
        }
    }




    async autorizarQR({request,response} : HttpContext){
        try{
            const id =  request.param('id')
            const generado = await Generado.findBy('id',id);
            if(!generado){
                return response.status(404).json({success:false,message:'QR inexistente.'})
            }

            const tresMinutos = 5 * 60 * 1000; // 5 minutos en milisegundos
            const tiempoActual = new Date().getTime();
            const tiempoCreacion = new Date(`${generado.createdAt}`).getTime();

            if (tiempoActual - tiempoCreacion > tresMinutos) {
                return response.status(403).json({ success: false, message: 'QR vencido.' });
            }

            if(generado.status == 1){
                return response.status(403).json({success:false,message:'QR ya autorizado'})
            }
            
            generado.status = 1;
            await generado.save();

            return response.json({success:true,message: 'Autorizado'})
        }
        catch(error){
            return response.status(500).json({success:false,error:'Error de servidor contactar con administrador'})
        }
    }






}