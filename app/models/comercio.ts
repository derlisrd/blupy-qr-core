import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Comercio extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre:string
  
  @column()
  declare descripcion:string

  @column()
  declare sucursal:string

  @column()
  declare key:string
  
  @column()
  declare logo:string


  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}