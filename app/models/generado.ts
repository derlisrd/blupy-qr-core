import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
// import { randomUUID } from 'node:crypto'
import Comercio from './comercio.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Moneda from './moneda.js'

export default class Generado extends BaseModel {

  protected tableName = 'generados'

  /* @beforeCreate()
  static async setID(generado: Generado) {
    generado.id = randomUUID()
  } */

  @beforeCreate()
  static async setID(generado: Generado) {
    generado.codigo = await Generado.generateUniqueCode()
  }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare monto: number

  @column()
  declare codigo: string

  @column()
  declare appel_codigo: number

  @column()
  declare web: boolean

  @column()
  declare farma: boolean

  @column()
  declare documento: string

  @column()
  declare numero_cuenta: string

  @column()
  declare numero_tarjeta: string

  @column()
  declare descripcion: string

  @column()
  declare cuotas: number

  @column()
  declare moneda_id: number

  @belongsTo(() => Moneda, {
    foreignKey: 'moneda_id'
  })
  declare moneda: BelongsTo<typeof Moneda>

  @column()
  declare condicion_venta: number

  @column()
  declare detalle: string

  @column()
  declare adicional: string

  @column()
  declare numero_movimiento: string

  @column()
  declare numero_comprobante: string

  @column()
  declare comercio_id: number

  @belongsTo(() => Comercio, {
    foreignKey: 'comercio_id'
  })
  declare comercio: BelongsTo<typeof Comercio>

  @column()
  declare status: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static async generateUniqueCode(): Promise<string> {
    let isUnique = false
    let codigo = ''

    while (!isUnique) {
      // Genera un número aleatorio entre 1 y 10 dígitos
      const length = Math.floor(Math.random() * 10) + 1
      codigo = Math.floor(Math.random() * Math.pow(10, length)).toString()

      // Verifica si el código ya existe en la base de datos
      const existing = await Generado.findBy('codigo', codigo)
      if (existing == null) {
        isUnique = true
      }
    }

    return codigo
  }
}
