import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'generados'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('codigo').nullable().after('id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName,(table) => {
      table.dropColumn('codigo')
    })
  }
}
