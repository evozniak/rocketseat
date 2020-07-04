import Notificacao from '../schemas/Notificacao';
import Usuario from '../models/Usuario';

class NotificacaoController {
	async index(req, res) {
		const ehPrestador = await Usuario.findOne({
			where: { id: req.idUsuario, prestador: true },
		});

		if (!ehPrestador) {
			return res
				.status(401)
				.json({ erro: 'Somente provedores podem ver as notificações.' });
		}

		const notificaoes = await Notificacao.find({
			usuario: req.idUsuario,
		})
			.sort({ createdAt: 'desc' })
			.limit(20);

		return res.json(notificaoes);
	}

	async atualizar(req, res) {
		// const notificacao = await Notificacao.findById(req.params.id);

		const notificacao = await Notificacao.findByIdAndUpdate(
			req.params.id,
			{ lida: true },
			{ new: true }
		);

		return res.json(notificacao);
	}
}

export default new NotificacaoController();
