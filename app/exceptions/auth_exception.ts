import { Exception } from '@adonisjs/core/exceptions'

export default class AuthException extends Exception {
  static status = 500

  mensaje(code : number){
    if(code === 400){
      return 'Error: credenciales invalidas'
    }
    if(code === 422){
      return 'Error: campos invalidos'
    }
    if(code === 500){
      return 'Error: servidor'
    }
  }

}