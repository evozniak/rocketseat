import * as Yup from 'yup';
import Destinatario from '../models/Destinatario';

class DestinatarioController {
    async buscar(req, res) {
        const destinatario = await Destinatario.findAll();

        return res.status(200).json(destinatario);
    }

    async armazenar(req, res) {
        const esquema = Yup.object().shape({
            nome: Yup.string().required().min(4),
            rua: Yup.string().required().min(4),
            complemento: Yup.string().required().min(6),
        });

        if (!(await esquema.isValid(req.body))) {
            return res.status(400).json({ erro: 'Erro de validação.' });
        }

        const destinatarioExiste = await Destinatario.findOne({
            where: { nome: req.body.nome },
        });

        if (destinatarioExiste) {
            return res.status(400).json({ erro: 'Destinatario já existe.' });
        }

        const {
            id,
            nome,
            rua,
            complemento,
            estado,
            cidade,
            cep,
        } = await Destinatario.create(req.body);

        return res.json({ id, nome, rua, complemento, estado, cidade, cep });
    }

    async atualizar(req, res) {
        const esquema = Yup.object().shape({
            nome: Yup.string().required().min(4),
            rua: Yup.string().required().min(4),
            complemento: Yup.string().required().min(6),
        });

        if (!(await esquema.isValid(req.body))) {
            return res.status(400).json({ erro: 'Erro de validação.' });
        }

        const destinatarioExiste = await Destinatario.findOne({
            where: { nome: req.body.nome },
        });
        if (destinatarioExiste) {
            req.body.id = destinatarioExiste.id;
        }
        await Destinatario.update(req.body, {
            where: { id: req.body.id },
        });

        return res.status(200).json({ msg: 'Atualizado.' });
    }
}

export default new DestinatarioController();
