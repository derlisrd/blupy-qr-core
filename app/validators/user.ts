import vine from '@vinejs/vine'


export const userLoginValidator = vine.compile(
    vine.object({
      email: vine.string() ,
      password: vine.string()
    })
  )