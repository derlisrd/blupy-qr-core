import type { HttpContext } from '@adonisjs/core/http'

import type { NextFn } from '@adonisjs/core/types/http'

export default class RequestLoggerMiddleware {
  async handle({request}: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    console.log(`[${new Date()}] ${request.method()} ${request.url()}`)
    await next()
    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}