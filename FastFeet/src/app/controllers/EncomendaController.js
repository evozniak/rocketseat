import * as Yup from 'yup';
import Encomenda from '../models/Encomenda';
import Arquivo from '../models/Arquivo';
import Destinatario from '../models/Destinatario';
import Entregador from '../models/Entregador';

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

        const {
            id,
            id_destinatario,
            id_entregador,
            id_assinatura,
            produto,
            cancelado_em,
            data_inicio,
            data_fim,
        } = await Encomenda.create(req.body);

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
            where: { nome: req.body.id },
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
