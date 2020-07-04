import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Agendamento from '../models/Agendamento';
import Usuario from '../models/Usuario';

class AgendaController {
	async index(req, res) {
		const ehPrestador = await Usuario.findOne({
			where: { id: req.idUsuario, prestador: true },
		});

		if (!ehPrestador) {
			return res.status(401).json({ erro: 'Usuário não é um prestador.' });
		}

		const { data: dataStr } = req.query;
		const data = parseISO(dataStr);

		const agendamentos = await Agendamento.findAll({
			where: {
				id_prestador: req.idUsuario,
				cancelado_em: null,
				data: {
					[Op.between]: [startOfDay(data), endOfDay(data)],
				},
			},
			order: ['data'],
		});

		return res.json({ agendamentos });
	}
}

export default new AgendaController();
