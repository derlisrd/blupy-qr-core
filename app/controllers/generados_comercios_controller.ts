import Comercio from '#models/comercio';
import Generado from '#models/generado';
import { generarQRValidator } from '#validators/generar';
import type { HttpContext } from '@adonisjs/core/http'

export default class GeneradosComerciosController {

    async generarQR({request,response} : HttpContext){
        try {
            const data = request.all()
            await generarQRValidator.validate(data)
            const req = request.only(['monto','descripcion','comercio_id','moneda_id'])
            const idMoneda = req.moneda_id ?? 1;
            const comercioFind = await Comercio.find(req.comercio_id);

            if(!comercioFind){
                return response.status(404).json({success:false,message:"ID de comercio no valido"})
            }

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
            console.log(error)
            const message = error.messages[0]['message'] ?? 'Error de servidor';
            return response.status(error.status).json({success:false,message})
        }
    }


    async consultarAutorizacion({request,response} : HttpContext){
        try{
           const id =  request.param('id')
           const generado = await Generado.find(id);
           if(!generado){
            return response.status(404).json({success:false,message:'No autorizado'})
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

           return response.json({success:true, message:'QR autorizado', results: generado})
        } catch (error) {
            return response.status(500).json({success:false,error:'Error de servidor contactar con administrador'})
        }
    }


    async revertir({request,response} : HttpContext){
        try {
            const {id} =  request.only(['id'])
            
            return response.json({success:true,message:'Revertido '+id})
        } catch (error) {
            console.log(error)
            return response.status(500).json({success:false,error:'Error de servidor contactar con administrador'})
        }
    }

}
