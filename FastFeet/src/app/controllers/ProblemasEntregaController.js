import * as Yup from 'yup';
import { request } from 'express';
import Entregador from '../models/Entregador';
import ProblemasEntrega from '../models/ProblemasEntrega';
import Encomenda from '../models/Encomenda';

class ProblemasEntregaController {
    async buscar(req, res) {
        const esquema = Yup.object().shape({
            id_encomenda: Yup.string().required(),
        });
        if (!(await esquema.isValid(req.body))) {
            return res.status(400).json({ erro: 'Erro de validação.' });
        }
        const problemasEntrega = await ProblemasEntrega.findAll({
            where: { id_encomenda: req.body.id_encomenda },
            include: [
                {
                    model: Encomenda,
                    as: 'encomenda',
                },
            ],
        });

        return res.status(200).json(problemasEntrega);
    }

    async armazenar(req, res) {
        const esquema = Yup.object().shape({
            id_encomenda: Yup.string().required(),
            descricao: Yup.string().required().min(4),
        });

        if (!(await esquema.isValid(req.body))) {
            return res.status(400).json({ erro: 'Erro de validação.' });
        }

        const problemaEntrega = await ProblemasEntrega.create(req.body);

        return res.json(problemaEntrega);
    }

    async cancelarEntrega(req, res) {
        const esquema = Yup.object().shape({
            id_problema: Yup.string().required(),
        });
        const { id_problema } = req.params;

        if (!(await esquema.isValid(req.params))) {
            return res.status(400).json({ erro: 'Erro de validação.' });
        }
        const problemaEntrega = await ProblemasEntrega.findOne({
            where: { id: id_problema },
        });

        if (!problemaEntrega) {
            return res
                .status(400)
                .json({ erro: `Problema ID: ${id_problema} não encontrado.` });
        }
        const encomenda = Encomenda.findByPk(problemaEntrega.id_encomenda);
        encomenda.cancelado_em = new Date();
        (await encomenda).update();

        return res.status(200).json({ ok: 'Encomenda cancelada com sucesso.' });
    }
}

export default new ProblemasEntregaController();
