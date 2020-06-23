import { Router } from 'express';
import Usuario from './app/models/Usuario';

const routes = new Router();

routes.get('/', async (req, res) => {
	const usuario = await Usuario.create({
		nome: 'Eduardo Vozniak',
		email: 'evozniak1@gmail.com',
		senha_hash: '312dcsasadSA233',
	});

	return res.json(usuario);
});

export default routes;
