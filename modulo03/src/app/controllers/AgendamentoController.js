import * as Yup from 'yup';
import Agendamento from '../models/Agendamento';
import Usuario from '../models/Usuario';

class AgendamentoController {
	async armazenar(req, res) {
		const esquema = Yup.object().shape({
			id_prestador: Yup.number().required(),
			data: Yup.date().required(),
		});

		if (!(await esquema.isValid(req.body))) {
			return res.status(400).json({ erro: 'Validação falhou.' });
		}

		const { id_prestador, data } = req.body;

		/**
		 * Validar se o id_prestador é um prestador.
		 */
		const ehFornecedor = await Usuario.findOne({
			where: { id: id_prestador, prestador: true },
		});

		if (!ehFornecedor) {
			return res
				.status(401)
				.json({ erro: 'Você só pode criar agendamentos com prestadores.' });
		}

		const agendamento = await Agendamento.create({
			id_usuario: req.idUsuario,
			id_prestador,
			data,
		});

		return res.json(agendamento);
	}
}

export default new AgendamentoController();
