import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'generados'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.integer('comercio_id')
        .unsigned()
        .references('id')
        .inTable('comercios')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.text('descripcion').nullable()
      table.double('monto',20,2)
      table.integer('cuotas').defaultTo(0)
      table.integer('moneda').defaultTo(1)
      table.text('numero').nullable()
      table.tinyint('status').defaultTo(0)


      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}