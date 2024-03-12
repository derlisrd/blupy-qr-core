import Comercio from '#models/comercio'
import type { HttpContext } from '@adonisjs/core/http'

export default class ComerciosController {

    async index({request,response} : HttpContext){
        try {
            const page = request.input('page', 1)
            const data = await Comercio.query().paginate(page)

            return response.json({
                success:true,
                meta: data.getMeta(),
                results: data.all()
            })
        } catch (error) {
            console.log(error)
            return response.status(error.status).json({success:false,message:'Error de servidor'})
        }
    }

    async store({response} : HttpContext){
        try {
            
        } catch (error) {
            console.log(error)
            return response.status(error.status).json({success:false,message:'Error de servidor'})
        }
    }

    async update({response} : HttpContext){
        try {
            
        } catch (error) {
            console.log(error)
            return response.status(error.status).json({success:false,message:'Error de servidor'})
        }
    }


}