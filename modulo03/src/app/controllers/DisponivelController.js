import {
	startOfDay,
	endOfDay,
	setHours,
	setMinutes,
	setSeconds,
	format,
	isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Agendamento from '../models/Agendamento';

class DisponivelController {
	async index(req, res) {
		const { data } = req.query;

		if (!data) {
			return res.status(400).json({ erro: 'Você precisa informar a data.' });
		}

		const dataPesquisa = Number(data);

		const agendamentos = await Agendamento.findAll({
			where: {
				id_prestador: req.params.idPrestador,
				cancelado_em: null,
				data: {
					[Op.between]: [startOfDay(dataPesquisa), endOfDay(dataPesquisa)],
				},
			},
		});

		const agenda = [
			'08:00',
			'09:00',
			'10:00',
			'11:00',
			'12:00',
			'13:00',
			'14:00',
			'15:00',
			'16:00',
			'17:00',
			'18:00',
			'19:00',
		];

		const datasDisponiveis = agenda.map((tempo) => {
			const [hora, minuto] = tempo.split(':');
			const valor = setSeconds(
				setMinutes(setHours(dataPesquisa, hora), minuto),
				0
			);
			return {
				tempo,
				valor: format(valor, "yyyy-MM-dd'T'HH:mm:ssxxx"),
				disponivel: isAfter(
					valor,
					new Date() &&
						!agendamentos.find((a) => format(a.data, 'HH:mm') === tempo)
				),
			};
		});

		return res.json(datasDisponiveis);
	}
}

export default new DisponivelController();
