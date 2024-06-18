import Comercio from '#models/comercio'
import Key from '#models/key'
import Moneda from '#models/moneda'
import User from '#models/user'
import env from '#start/env'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.create({
      email: 'admin@blupy.com.py',
      nombre: 'Admin',
      password: '12345',
      doc: '000',
      rol: 0
    })

    await Comercio.create({ nombre: 'Farma', sucursal: '12', descripcion: 'a' })

    await Key.create({ key: env.get('KEY_BASE'), user_id: 1, activo: 1 })

    await Moneda.create({ denominacion: 'Guarani', abreviatura: 'GS', valor: 1 })
  }
}
