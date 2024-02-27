import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Generado extends BaseModel {

  static get table(){
    return 'generados'
  }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare monto:number
  
  @column()
  declare descripcion:string

  @column()
  declare cuotas:number

  @column()
  declare moneda:number
  
  @column()
  declare numero:string

  @column()
  declare comercio_id:number

  @column()
  declare status:number


  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}