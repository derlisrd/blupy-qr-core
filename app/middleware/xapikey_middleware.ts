import Key from '#models/key'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class XapikeyMiddleware {
  async handle({response,request}: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    //console.log(ctx)
    const apiKey = request.header('x-api-key')
    const userApiKey  = request.header('user-api-key')

    const foundApi = await Key.findBy('user_id',`${userApiKey}`)

    if(!foundApi){
      return response.status(401).json({ success:false,message:'Keys invalidas' })
    }

    if (!apiKey || apiKey !== foundApi.key) {
      return response.status(401).json({ success:false,message:'API KEY invalido' })
    }
    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}