import { Exception } from '@adonisjs/core/exceptions'

export default class GenerarException extends Exception {
  static status = 500

  mensaje(code : number, message: string){
    if(code === 400){
      return 'Error: credenciales invalidas'
    }
    if(code === 422){
      return message
    }
    if(code === 500){
      return 'Error: servidor'
    }
  }
}