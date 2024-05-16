import AuthException from '#exceptions/auth_exception'
import User from '#models/user'
import env from '#start/env'
import { userLoginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import jwt from 'jsonwebtoken'
//import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    try {
      const data = request.all()
      await userLoginValidator.validate(data)
      const user = await User.verifyCredentials(data.email, data.password)
      //user.serialize()
      //const token = await User.accessTokens.create(user)
      const token = jwt.sign({ id: user.id, email: user.email }, env.get('JWT_SECRET', ''), {
        expiresIn: '15 minutes',
      })
      return response.json({
        success: true,
        results: {
          token,
        },
      })
      //return response.json({ success: true, results: token })
    } catch (error) {
      const authError = new AuthException()
      return response
        .status(error.status)
        .json({ success: false, message: authError.mensaje(error.status) })
    }
  }
  async logout({ response }: HttpContext) {
    try {
      return response.json({ success: true })
    } catch (error) {
      return response.status(error.status).json({ success: false, message: 'Error de servidor' })
    }
  }
}
