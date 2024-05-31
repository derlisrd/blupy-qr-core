import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Moneda extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare denominacion: string
  @column()
  declare abreviatura: string

  @column()
  declare valor: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
