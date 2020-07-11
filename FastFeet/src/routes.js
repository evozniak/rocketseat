import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessaoController from './app/controllers/SessaoController';
import DestinatarioController from './app/controllers/DestinatarioController';

import authMiddleware from './app/middlewares/auth';
import EntregadorController from './app/controllers/EntregadorController';
import ArquivoController from './app/controllers/ArquivoController';
import EncomendaController from './app/controllers/EncomendaController';
import DeliveryManController from './app/controllers/DeliveryManController';
import ProblemasEntregaController from './app/controllers/ProblemasEntregaController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessoes', SessaoController.armazenar);

routes.use(authMiddleware);

routes.get('/destinatarios', DestinatarioController.buscar);
routes.post('/destinatarios', DestinatarioController.armazenar);
routes.put('/destinatarios', DestinatarioController.atualizar);

routes.get('/entregadores', EntregadorController.buscar);
routes.post('/entregadores', EntregadorController.armazenar);
routes.put('/entregadores', EntregadorController.atualizar);
routes.delete('/entregadores/:id', EntregadorController.apagar);

routes.get('/encomendas', EncomendaController.buscar);
routes.post('/encomendas', EncomendaController.armazenar);
routes.put('/encomendas', EncomendaController.atualizar);
routes.delete('/encomendas/:id', EncomendaController.apagar);

routes.post('/arquivos', upload.single('file'), ArquivoController.armazenar);

routes.get('/deliveryman/:id', DeliveryManController.buscarPendentes);
routes.get(
    '/deliveryman/:id/deliveries',
    DeliveryManController.buscarEntregues
);
routes.post('/deliveryman/retirar', DeliveryManController.retirar);
routes.post('/deliveryman/entregar', DeliveryManController.entregar);

routes.get('/entregas/:id/problemas', ProblemasEntregaController.buscar);
routes.post('/entregas/:id/problemas', ProblemasEntregaController.armazenar);
routes.delete(
    '/problemas/:id_problema/cancelar-entrega',
    ProblemasEntregaController.cancelarEntrega
);

export default routes;
