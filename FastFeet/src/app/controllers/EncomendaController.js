import * as Yup from 'yup';
import { format, parseISO } from 'date-fns';
import Encomenda from '../models/Encomenda';
import Arquivo from '../models/Arquivo';
import Destinatario from '../models/Destinatario';
import Entregador from '../models/Entregador';
import Queue from '../../lib/Queue';
import EmailNovaEntrega from '../jobs/EmailNovaEntrega';

class EncomendaController {
    async buscar(req, res) {
        const destinatario = await Encomenda.findAll({
            include: [
                {
                    model: Destinatario,
                    as: 'destinatario',
                },
                {
                    model: Entregador,
                    as: 'entregador',
                },
                {
                    model: Arquivo,
                    as: 'assinatura',
                    attributes: ['nome', 'caminho', 'url'],
                },
            ],
        });

        return res.status(200).json(destinatario);
    }

    async armazenar(req, res) {
        const esquema = Yup.object().shape({
            id_destinatario: Yup.number().required(),
            id_entregador: Yup.number().required(),
            produto: Yup.string().required().min(4),
        });

        if (!(await esquema.isValid(req.body))) {
            return res.status(400).json({
                erro: 'Erro de validação. Campos obrigatórios não informados.',
            });
        }

        const { data_inicio: req_data_inicio } = req.body;
        if (req_data_inicio) {
            const req_data_parse = parseISO(req_data_inicio);
            const hora = format(req_data_parse, 'hh');
            if (hora < 8 || hora >= 18) {
                return res.status(400).json({
                    erro: 'A data de inicio deve ser entre 08:00H e 18:00H.',
                });
            }
        }

        const encomenda = await Encomenda.create(req.body);
        const {
            id,
            id_destinatario,
            id_entregador,
            id_assinatura,
            produto,
            cancelado_em,
            data_inicio,
            data_fim,
            created_at,
        } = encomenda;

        const entregador = await Entregador.findByPk(id_entregador);

        const encomEntregador = {
            id,
            id_destinatario,
            id_entregador,
            id_assinatura,
            produto,
            cancelado_em,
            data_inicio,
            data_fim,
            created_at,
            entregador: { nome: entregador.nome, email: entregador.email },
        };

        await Queue.add(EmailNovaEntrega.chave, {
            encomEntregador,
        });

        return res.json({
            id,
            id_destinatario,
            id_entregador,
            id_assinatura,
            produto,
            cancelado_em,
            data_inicio,
            data_fim,
        });
    }

    async atualizar(req, res) {
        const esquema = Yup.object().shape({
            id_destinatario: Yup.number().required(),
            id_entregador: Yup.number().required(),
            produto: Yup.string().required().min(4),
        });

        if (!(await esquema.isValid(req.body))) {
            return res.status(400).json({ erro: 'Erro de validação.' });
        }

        const encomendaExiste = await Encomenda.findOne({
            where: { id: req.body.id },
        });
        if (encomendaExiste) {
            req.body.id = encomendaExiste.id;
        }
        await Encomenda.update(req.body, {
            where: { id: req.body.id },
        });

        return res.status(200).json({ msg: 'Atualizado.' });
    }

    async apagar(req, res) {
        const { id } = req.params;
        if (!id) {
            return res
                .status(400)
                .json({ erro: 'O ID é obrigatório e não foi informado.' });
        }
        const encomenda = await Encomenda.findByPk(id);

        if (!encomenda) {
            return res
                .status(400)
                .json({ erro: `Encomenda ID:${id} não encontrada.` });
        }
        encomenda.destroy();

        return res.status(200).json({ msg: 'Excluído.' });
    }
}

export default new EncomendaController();
