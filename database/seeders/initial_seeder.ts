import Comercio from '#models/comercio'
import Key from '#models/key'
import Moneda from '#models/moneda'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
   await User.create({email:'blupy@blupy.com.py',nombre:'Demo',password:'12345',doc:'000'})

   await Comercio.create({nombre:'Farma',sucursal:'12',descripcion:'a'})

   await Key.create({key:'asdfg8awenrasd8f',user_id:1})

   await Moneda.create({denominacion:'Guarani', abreviatura:'GS', valor:1})
  }
}