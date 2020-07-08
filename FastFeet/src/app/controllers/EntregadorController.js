import * as Yup from 'yup';
import Entregador from '../models/Entregador';
import Arquivo from '../models/Arquivo';

class EntregadorController {
    async buscar(req, res) {
        const entregador = await Entregador.findAll({
            attributes: ['id', 'nome', 'email', 'id_avatar'],
            include: [
                {
                    model: Arquivo,
                    as: 'avatar',
                    attributes: ['nome', 'caminho', 'url'],
                },
            ],
        });

        return res.status(200).json(entregador);
    }

    async armazenar(req, res) {
        const esquema = Yup.object().shape({
            nome: Yup.string().required().min(4),
            email: Yup.string().required().min(4),
            id_avatar: Yup.string().required(),
        });

        if (!(await esquema.isValid(req.body))) {
            return res.status(400).json({ erro: 'Erro de validação.' });
        }

        const entregadorExiste = await Entregador.findOne({
            where: { nome: req.body.email },
        });

        if (entregadorExiste) {
            return res.status(400).json({ erro: 'Entregador já existe.' });
        }

        const { id, nome, id_avatar, email } = await Entregador.create(
            req.body
        );

        return res.json({ id, nome, id_avatar, email });
    }

    async atualizar(req, res) {
        const esquema = Yup.object().shape({
            nome: Yup.string().required().min(4),
            email: Yup.string().required().min(4),
            id_avatar: Yup.string().required(),
        });

        if (!(await esquema.isValid(req.body))) {
            return res.status(400).json({ erro: 'Erro de validação.' });
        }

        const entregadorExiste = await Entregador.findOne({
            where: { nome: req.body.email },
        });
        if (entregadorExiste) {
            req.body.id = entregadorExiste.id;
        }
        await Entregador.update(req.body, {
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
        const entregador = await Entregador.findByPk(id);

        if (!entregador) {
            return res
                .status(400)
                .json({ erro: `Entregador ID:${id} não encontrado.` });
        }
        entregador.destroy();

        return res.status(200).json({ msg: 'Excluído.' });
    }
}

export default new EntregadorController();
