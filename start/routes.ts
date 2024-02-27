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
    router.post('/autorizar-qr/:id',[GeneradosController,'autorizarQR'])
})






//router.post('/autorizar-qr',[GeneradosController,'autorizar'])
