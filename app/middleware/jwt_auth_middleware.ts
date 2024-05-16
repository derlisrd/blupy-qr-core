import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import jwt from 'jsonwebtoken'
import env from '#start/env'

export default class JwtAuthMiddleware {
  async handle({ response, request }: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    //console.log(ctx)
    const authorization = request.header('Authorization')
    /**
     * Call next method in the pipeline and return its output
     */
    if (!authorization) {
      return response.unauthorized({ success: false, message: 'No autenticado.' })
    }
    const token = authorization.replace('Bearer ', '')

    try {
      const decoded = jwt.verify(token, env.get('JWT_SECRET', ''))
      // Agregar el usuario decodificado al contexto
      //request['user'] = decoded
      console.log(decoded)
      await next()
    } catch (error) {
      return response.unauthorized({ success: false, message: 'Invalid token' })
    }
    const output = await next()
    return output
  }
}
