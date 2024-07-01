/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/auth_controller')
const GeneradosClientesController = () => import('#controllers/generados_clientes_controller')
const GeneradosComerciosController = () => import('#controllers/generados_comercios_controller')
const ComerciosController = () => import('#controllers/comercios_controller')

router
  .group(() => {
    router.post('/login', [AuthController, 'login'])
  })
  .prefix('/auth')

router
  .group(() => {
    router.post('/generar-qr', [GeneradosComerciosController, 'generarQR'])
    // router.delete('/anular/:id', [GeneradosComerciosController, 'anular'])
    router.delete('/anular', [GeneradosComerciosController, 'anular'])
    router.put('/revertir-pago', [GeneradosComerciosController, 'revertirPago'])
    router.get('/consultar-autorizacion/:id', [GeneradosComerciosController,'consultarAutorizacion'])
    router.put('/actualizar-movimiento',[GeneradosComerciosController,'actualizarMovimiento'])
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
