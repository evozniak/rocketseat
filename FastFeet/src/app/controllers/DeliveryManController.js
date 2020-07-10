import * as Yup from 'yup';
import { Op } from 'sequelize';
import { startOfDay, endOfDay } from 'date-fns';
import Entregador from '../models/Entregador';
import Arquivo from '../models/Arquivo';
import Encomenda from '../models/Encomenda';
import Destinatario from '../models/Destinatario';

class DeliveryManController {
    async buscarPendentes(req, res) {
        const encomenda = await Encomenda.findAll({
            where: {
                cancelado_em: null,
                data_fim: null,
                id_entregador: req.params.id,
            },
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

        return res.status(200).json(encomenda);
    }

    async buscarEntregues(req, res) {
        const encomenda = await Encomenda.findAll({
            where: {
                id_entregador: req.params.id,
                data_fim: { [Op.not]: null },
            },
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

        return res.status(200).json(encomenda);
    }

    async retirar(req, res) {
        const esquema = Yup.object().shape({
            id_encomenda: Yup.string().required(),
            id_entregador: Yup.string().required(),
        });

        if (!(await esquema.isValid(req.body))) {
            return res.status(400).json({ erro: 'Erro de validação.' });
        }

        const entregador = await Entregador.findOne({
            where: { id: req.body.id_entregador },
        });

        if (!entregador) {
            return res.status(400).json({ erro: 'Entregador não encontrado.' });
        }
        const retiradasNoDia = await Encomenda.findAll({
            where: {
                data_inicio: {
                    [Op.between]: [
                        startOfDay(new Date()),
                        endOfDay(new Date()),
                    ],
                },
                id_entregador: req.body.id_entregador,
            },
        });
        const qtdRetiradasDia = retiradasNoDia.length;
        if (qtdRetiradasDia > 5) {
            return res.status(400).json({
                erro: 'O entregador pode fazer no máximo 5 retiradas por dia.',
            });
        }

        const encomenda = await Encomenda.findByPk(req.body.id_encomenda);

        if (encomenda.data_inicio) {
            return res
                .status(400)
                .json({ erro: 'A encomenda já foi retirada.' });
        }

        encomenda.data_inicio = new Date();
        encomenda.save();

        return res.json({
            mensagem: `Encomenda ID: ${encomenda.id} retirada em: ${encomenda.data_inicio}`,
        });
    }

    async entregar(req, res) {
        const esquema = Yup.object().shape({
            id_encomenda: Yup.string().required(),
            id_entregador: Yup.string().required(),
            id_arquivo: Yup.string().required(),
        });

        if (!(await esquema.isValid(req.body))) {
            return res.status(400).json({ erro: 'Erro de validação.' });
        }

        const entregador = await Entregador.findOne({
            where: { id: req.body.id_entregador },
        });

        if (!entregador) {
            return res.status(400).json({ erro: 'Entregador não encontrado.' });
        }

        const encomenda = await Encomenda.findByPk(req.body.id_encomenda);

        if (encomenda.data_fim) {
            return res
                .status(400)
                .json({ erro: 'A encomenda já foi entregue.' });
        }

        encomenda.data_fim = new Date();
        encomenda.id_assinatura = req.body.id_arquivo;
        encomenda.save();

        return res.json({
            mensagem: `Encomenda ID: ${encomenda.id} entrege em: ${encomenda.data_inicio}`,
        });
    }
}

export default new DeliveryManController();
