/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
const GeneradosClientesController = () => import('#controllers/generados_clientes_controller')
const GeneradosComerciosController = () => import('#controllers/generados_comercios_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const ComerciosController = () => import('#controllers/comercios_controller')

router
  .group(() => {
    router.post('/login', [AuthController, 'login'])
  })
  .prefix('/auth')

router
  .group(() => {
    router.post('/generar-qr', [GeneradosComerciosController, 'generarQR'])
    router.put('/revertir-pago', [GeneradosComerciosController, 'revertirPago'])
    router.get('/consultar-autorizacion/:id', [
      GeneradosComerciosController,
      'consultarAutorizacion',
    ])
  })
  .prefix('comercio')
  .use(middleware.jwt())

router
  .group(() => {
    router.get('/comercios', [ComerciosController, 'index']).use(middleware.rol(2))
  })
  .prefix('admin')
  .use(middleware.jwt())

router
  .group(() => {
    router.post('/autorizar-qr', [GeneradosClientesController, 'autorizarQR'])
    router.get('/consultar-qr/:id', [GeneradosClientesController, 'consultarQR'])
  })
  .prefix('cliente')

router.get('*', async ({ response }) => {
  return response.status(404).json({ success: false, message: 'Ruta no encontrada' })
})
