import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'crypto'
import Comercio from './comercio.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Moneda from './moneda.js'


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
  declare numero_cuenta:string

  @column()
  declare descripcion:string

  @column()
  declare cuotas:number

  @column()
  declare moneda_id:number

  @belongsTo(() => Moneda,{
    foreignKey:'moneda_id'
  })
  declare moneda: BelongsTo<typeof Moneda>
  
  @column()
  declare numero_movimiento:string

  @column()
  declare comercio_id:number
  
  @belongsTo(() => Comercio,{
    foreignKey:'comercio_id'
  })
  declare comercio: BelongsTo<typeof Comercio>

  @column()
  declare status:number


  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}