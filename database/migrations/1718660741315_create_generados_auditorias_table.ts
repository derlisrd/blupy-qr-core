import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'generados_auditorias'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('generado_id')
        .unsigned()
        .references('id')
        .inTable('generados')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.text('telefono').nullable()
      table.text('localizacion').nullable()
      table.text('status').defaultTo('GENERADO')
      table.text('ip_user').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
