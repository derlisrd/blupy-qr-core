import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Key extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id:number
  
  @column()
  declare key:string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}