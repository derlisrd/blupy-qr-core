import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'generados'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.bigInteger('appel_codigo').nullable().after('codigo')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName,(table) => {
      table.dropColumn('appel_codigo')
    })
  }
}
