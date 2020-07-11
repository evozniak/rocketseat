import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import Mail from '../../lib/Mail';

class EmailEncomendaCancelada {
    get chave() {
        return 'EmailEncomendaCancelada';
    }

    async processar({ data }) {
        // console.log(data);
        const { encomenda, problema } = data.encomProblema;
        console.log(encomenda);
        console.log(problema);
        await Mail.enviarEmail({
            to: `${encomenda.entregador.nome} <${encomenda.entregador.email}>`,
            subject: 'Entrega cancelada',
            template: 'encomendaCancelada',
            context: {
                entregador: encomenda.entregador.nome,
                produto: encomenda.produto,
                motivo: problema.descricao,
                data: format(
                    parseISO(encomenda.created_at),
                    "'dia' dd 'de' MMMM', às' H:mm'h'",
                    {
                        locale: pt,
                    }
                ),
            },
        });
    }
}

export default new EmailEncomendaCancelada();
