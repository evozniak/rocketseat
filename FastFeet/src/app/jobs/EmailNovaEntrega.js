import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import Mail from '../../lib/Mail';

class EmailNovaEntrega {
    get chave() {
        return 'EmailNovaEntrega';
    }

    async processar({ data }) {
        const { encomEntregador: encomenda } = data;
        await Mail.enviarEmail({
            to: `${encomenda.entregador.nome} <${encomenda.entregador.email}>`,
            subject: 'Nova encomenda',
            template: 'novaEntrega',
            context: {
                entregador: encomenda.entregador.nome,
                usuario: encomenda.produto,
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

export default new EmailNovaEntrega();
