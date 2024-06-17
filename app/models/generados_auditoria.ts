import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { BelongsTo } from '@adonisjs/lucid/types/relations'
import Generado from './generado.js'

export default class GeneradoAuditoria extends BaseModel {

  static get table() {
    return 'generados_auditorias'
  }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare ip_user: string

  @column()
  declare status: string

  @column()
  declare telefono: string

  @column()
  declare localizacion: string

  @column()
  declare generado_id: number

  @belongsTo(() => Generado, {
    foreignKey: 'generado_id'
  })
  declare moneda: BelongsTo<typeof Generado>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
