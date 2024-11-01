import axios from 'axios'
import env from '#start/env'

export async function SupabaseLOG(origen: string, detalles: string): Promise<boolean> {
  try {
    await axios.post(
      `${env.get('SUPABASE_URL')}/rest/v1/logs`,
      {
        origin: origen,
        details: detalles
      },
      {
        headers: {
          apikey: env.get('SUPABASE_API_KEY'),
          Authorization: `Bearer ${env.get('SUPABASE_API_KEY')}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}
