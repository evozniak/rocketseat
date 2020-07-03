import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UsuarioController from './app/controllers/UsuarioController';
import SessaoController from './app/controllers/SessaoController';
import ArquivoController from './app/controllers/ArquivoController';
import PrestadorController from './app/controllers/PrestadorController';

import authMiddleware from './app/middlewares/auth';
import AgendamentoController from './app/controllers/AgendamentoController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/usuarios', UsuarioController.armazenar);
routes.post('/sessoes', SessaoController.armazenar);

routes.use(authMiddleware);

routes.put('/usuarios', UsuarioController.atualizar);

routes.get('/prestadores', PrestadorController.index);

routes.post('/agendamentos', AgendamentoController.armazenar);

routes.post('/arquivos', upload.single('file'), ArquivoController.armazenar);

export default routes;
