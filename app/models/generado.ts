import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'crypto'

export default class Generado extends BaseModel {

  static get table(){
    return 'generados'
  }

  @beforeCreate()
  public static async setID(generado : Generado){
    generado.id = randomUUID()
  }

  @column({ isPrimary: true })
  declare id:  string

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