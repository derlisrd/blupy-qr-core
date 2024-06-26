import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email', 'doc'],
  passwordColumnName: 'password'
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string | null

  @column()
  declare doc: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare first: number

  @column()
  declare rol: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '20 minutes',
    prefix: 'jwt_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40
  })
}
