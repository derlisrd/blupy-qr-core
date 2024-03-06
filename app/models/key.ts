import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@adonisjs/lucid/orm'
import { randomUUID } from 'crypto'
export default class Key extends BaseModel {
  
  
  @beforeCreate()
  public static async setID(key : Key){
    key.id = randomUUID()
  }


  @column({ isPrimary: true })
  declare id:  string

  @column()
  declare user_id:number
  
  @column()
  declare activo:number
  
  @column()
  declare key:string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}