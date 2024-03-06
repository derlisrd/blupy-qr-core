/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller';
import GeneradosClientesController from '#controllers/generados_clientes_controller';
import GeneradosComerciosController from '#controllers/generados_comercios_controller';
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import ComerciosController from '#controllers/comercios_controller';

router.group(()=>{
    router.post('/login',[AuthController,'login']);
}).prefix('/auth')


router.group(()=>{
    router.post('/generar-qr',[GeneradosComerciosController,'generarQR']);
    router.get('/consultar-autorizacion/:id',[GeneradosComerciosController,'consultarAutorizacion'])
}).prefix('comercio').use(middleware.auth())



router.group(()=>{
    router.get('/comercios',[ComerciosController,'index']).use(middleware.rol(2));

}).prefix('admin').use(middleware.auth())



router.group(()=>{
    router.post('/autorizar-qr',[GeneradosClientesController,'autorizarQR'])
    router.get('/consultar-qr/:id',[GeneradosClientesController,'consultarQR'])
}).prefix('cliente')

router.get('*', async ({ response }) => {
    return response.status(404).json({ success: false, message: 'Ruta no encontrada' });
  });




