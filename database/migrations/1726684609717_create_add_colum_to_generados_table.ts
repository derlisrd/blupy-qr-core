import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'generados'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('web').defaultTo(0).nullable().after('codigo')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName,(table) => {
      table.dropColumn('web')
    })
  }
}
