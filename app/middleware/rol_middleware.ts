import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RolMiddleware {
  async handle({ auth,response}: HttpContext, next: NextFn, rol:number) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const user = auth.getUserOrFail()
    const currentRol = (user.rol)
    if(currentRol< rol){
      return response.status(401).json({success:false,message:'No tiene permiso'})
    }
    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}