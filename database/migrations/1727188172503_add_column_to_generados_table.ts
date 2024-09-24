import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'generados'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('mtnume').defaultTo('1').nullable().after('numero_cuenta')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName,(table) => {
      table.dropColumn('mtnume')
    })
  }
}
