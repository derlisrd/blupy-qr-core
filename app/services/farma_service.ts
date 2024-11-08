import axios from 'axios'
import env from '#start/env'

export const ConfirmarPago = async (data: any) => {
  const res = await axios.post(`${env.get('APIURL_FARMA')}/confirmar`, data, {
    headers: {
      username: env.get('USERNAME_FARMA'),
      password: env.get('PASSWORD_FARMA'),
      'Content-Type': 'application/json'
    }
  })
  return res
}
