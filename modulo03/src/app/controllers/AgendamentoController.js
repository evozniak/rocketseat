import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import Agendamento from '../models/Agendamento';
import Arquivo from '../models/Arquivo';
import Usuario from '../models/Usuario';
import Notificacao from '../schemas/Notificacao';

import EmailCancelamento from '../jobs/EmailCancelamento';
import Queue from '../../lib/Queue';

class AgendamentoController {
	async index(req, res) {
		const { pagina = 1 } = req.query;

		const agendamentos = await Agendamento.findAll({
			where: { id_usuario: req.idUsuario, cancelado_em: null },
			order: ['data'],
			attributes: ['id', 'data', 'passou', 'pode_cancelar'],
			limit: 20,
			offset: (pagina - 1) * 10,
			include: [
				{
					model: Usuario,
					as: 'prestador',
					attributes: ['id', 'nome'],
					include: [
						{
							model: Arquivo,
							as: 'avatar',
							attributes: ['id', 'caminho', 'url'],
						},
					],
				},
			],
		});

		return res.json(agendamentos);
	}

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
		const ehPrestador = await Usuario.findOne({
			where: { id: id_prestador, prestador: true },
		});

		if (!ehPrestador) {
			return res
				.status(401)
				.json({ erro: 'Você só pode criar agendamentos com prestadores.' });
		}

		const horaInicio = startOfHour(parseISO(data));
		if (isBefore(horaInicio, new Date())) {
			return res.status(400).json({ erro: 'O horario informado já passou.' });
		}

		const verificarDisponibilidade = await Agendamento.findOne({
			where: {
				id_prestador,
				cancelado_em: null,
				data: horaInicio,
			},
		});

		if (verificarDisponibilidade) {
			return res
				.status(400)
				.json({ erro: 'O horário informado já está reservado.' });
		}

		const agendamento = await Agendamento.create({
			id_usuario: req.idUsuario,
			id_prestador,
			data: horaInicio,
		});

		const usuario = await Usuario.findByPk(req.idUsuario);
		const dataFormatada = format(
			horaInicio,
			"'dia' dd 'de' MMMM', às' H:mm'h'",
			{ locale: pt }
		);

		await Notificacao.create({
			conteudo: `Novo agendamento de ${usuario.nome} para ${dataFormatada}`,
			usuario: id_prestador,
		});

		return res.json(agendamento);
	}

	async deletar(req, res) {
		const agendamento = await Agendamento.findByPk(req.params.id, {
			include: [
				{
					model: Usuario,
					as: 'prestador',
					attributes: ['nome', 'email'],
				},
				{
					model: Usuario,
					as: 'usuario',
					attributes: ['nome'],
				},
			],
		});

		if (agendamento.id_usuario !== req.idUsuario) {
			return res.status(401).json({
				erro: 'Você não tem permissão para excluir esse agendamento.',
			});
		}

		const dataLimite = subHours(agendamento.data, 2);

		if (isBefore(dataLimite, new Date())) {
			return res.status(401).json({
				erro:
					'Você só pode cancelar agendamentos até duas horas de antecedência.',
			});
		}

		agendamento.cancelado_em = new Date();

		await agendamento.save();

		await Queue.add(EmailCancelamento.chave, {
			agendamento,
		});

		return res.json(agendamento);
	}
}

export default new AgendamentoController();
