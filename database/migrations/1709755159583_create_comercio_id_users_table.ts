import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('comercio_id').after('id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName,(table)=>{
      table.dropColumn('comercio_id')
    })
  }
}