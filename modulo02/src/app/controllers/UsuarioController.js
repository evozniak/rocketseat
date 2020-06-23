import * as Yup from 'yup';
import Usuario from '../models/Usuario';

class UsuarioController {
	async armazenar(req, res) {
		const esquema = Yup.object().shape({
			nome: Yup.string().required(),
			email: Yup.string().email().required(),
			senha: Yup.string().required().min(6),
		});

		if (!(await esquema.isValid(req.body))) {
			return res.status(400).json({ erro: 'Erro de validação.' });
		}

		const usuarioExiste = await Usuario.findOne({
			where: { email: req.body.email },
		});

		if (usuarioExiste) {
			return res.status(400).json({ erro: 'Usuário já existe.' });
		}

		const { id, nome, email, fornecedor } = await Usuario.create(req.body);

		return res.json({ id, nome, email, fornecedor });
	}

	async atualizar(req, res) {
		const { email, senhaAnterior } = req.body;

		const esquema = Yup.object().shape({
			nome: Yup.string(),
			email: Yup.string().email(),
			senhaAnterior: Yup.string().min(6),
		});

		if (!(await esquema.isValid(req.body))) {
			return res.status(400).json({ erro: 'Erro de validação.' });
		}

		const usuario = await Usuario.findByPk(req.idUsuario);

		if (email !== usuario.email) {
			const usuarioExiste = await Usuario.findOne({
				where: { email },
			});

			if (usuarioExiste) {
				return res.status(400).json({ erro: 'Usuário já existe.' });
			}
		}

		if (senhaAnterior && !(await usuario.verificarSenha(senhaAnterior))) {
			return res.status(401).json({ erro: 'As senhas não batem.' });
		}

		const { id, nome, fornecedor } = await usuario.update(req.body);

		return res.json({ id, nome, email, fornecedor });
	}
}

export default new UsuarioController();
