import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UsuarioController from './app/controllers/UsuarioController';
import SessaoController from './app/controllers/SessaoController';
import ArquivoController from './app/controllers/ArquivoController';
import PrestadorController from './app/controllers/PrestadorController';
import NotificacaoControler from './app/controllers/NotificacaoController';

import authMiddleware from './app/middlewares/auth';
import AgendamentoController from './app/controllers/AgendamentoController';
import AgendaController from './app/controllers/AgendaController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/usuarios', UsuarioController.armazenar);
routes.post('/sessoes', SessaoController.armazenar);

routes.use(authMiddleware);

routes.put('/usuarios', UsuarioController.atualizar);

routes.get('/prestadores', PrestadorController.index);

routes.get('/agendamentos', AgendamentoController.index);
routes.post('/agendamentos', AgendamentoController.armazenar);
routes.delete('/agendamentos/:id', AgendamentoController.deletar);

routes.get('/agenda', AgendaController.index);

routes.get('/notificacoes', NotificacaoControler.index);
routes.put('/notificacoes/:id', NotificacaoControler.atualizar);

routes.post('/arquivos', upload.single('file'), ArquivoController.armazenar);

export default routes;
