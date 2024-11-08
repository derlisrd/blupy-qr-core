import axios from 'axios'
import env from '#start/env'

export const ConfirmarPago = async (data: any) => {
  try {
    const res = await axios.post(`${env.get('APIURL_FARMA')}/confirmar`, data, {
      headers: {
        username: env.get('USERNAME_FARMA'),
        password: env.get('PASSWORD_FARMA'),
        'Content-Type': 'application/json'
      }
    })
    console.log(res.data)
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.toJSON)
    }
    console.log(error)
    return error
  }
}
