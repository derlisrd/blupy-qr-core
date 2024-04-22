import type { HttpContext } from '@adonisjs/core/http'

import type { NextFn } from '@adonisjs/core/types/http'

export default class RequestLoggerMiddleware {
  async handle({ request }: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const fecha = new Date()
    const format = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')} ${fecha.getHours()}:${String(fecha.getMinutes()).padStart(2, '0')}:${String(fecha.getSeconds()).padStart(2, '0')} `
    console.log(`[${format}] ${request.method()} ${request.url()}`)
    await next()
    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
