import { Router } from 'express';
import SessaoController from './app/controllers/SessaoController';
import DestinatarioController from './app/controllers/DestinatarioController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessoes', SessaoController.armazenar);

routes.use(authMiddleware);

routes.get('/destinatarios', DestinatarioController.buscar);
routes.post('/destinatarios', DestinatarioController.armazenar);
routes.put('/destinatarios', DestinatarioController.atualizar);

export default routes;
