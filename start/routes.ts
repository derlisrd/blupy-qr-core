/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import GeneradosController from '#controllers/generados_controller'
import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'



router.group(()=>{
    router.post('/generar-qr',[GeneradosController,'generarQR']);
    router.get('/consultar-autorizacion/:id',[GeneradosController,'consultarAutorizacion'])
}).prefix('comercio')

router.group(()=>{
    router.post('/autorizar-qr',[GeneradosController,'autorizarQR'])
    router.get('/consultar-qr/:id',[GeneradosController,'consultarQR'])
}).prefix('cliente')

router.get('*', async ({ response }) => {
    return response.status(404).json({ success: false, message: 'Ruta no encontrada' });
  });




//router.post('/autorizar-qr',[GeneradosController,'autorizar'])
