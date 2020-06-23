import { Router } from 'express';

import UsuarioController from './app/controllers/UsuarioController';
import SessaoController from './app/controllers/SessaoController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/usuarios', UsuarioController.armazenar);
routes.post('/sessoes', SessaoController.armazenar);

routes.use(authMiddleware);

routes.put('/usuarios', UsuarioController.atualizar);

export default routes;
