import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import Mail from '../../lib/Mail';

class EmailCancelamento {
	get chave() {
		return 'EmailCancelamento';
	}

	async processar({ data }) {
		const { agendamento } = data;
		await Mail.enviarEmail({
			to: `${agendamento.prestador.nome} <${agendamento.prestador.email}>`,
			subject: 'Agendamento cancelado',
			template: 'cancelamento',
			context: {
				prestador: agendamento.prestador.nome,
				usuario: agendamento.usuario.nome,
				data: format(
					parseISO(agendamento.data),
					"'dia' dd 'de' MMMM', às' H:mm'h'",
					{
						locale: pt,
					}
				),
			},
		});
	}
}

export default new EmailCancelamento();
