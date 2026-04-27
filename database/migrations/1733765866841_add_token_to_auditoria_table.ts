import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'generados_auditorias'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('token').nullable().after('ip_user')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName,(table) => {
      table.dropColumn('token')
    })
  }
}
