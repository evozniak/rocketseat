import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import Usuario from '../models/Usuario';
import authConfig from '../../config/auth';

class SessaoController {
    async armazenar(req, res) {
        const esquema = Yup.object().shape({
            email: Yup.string().email().required(),
            senha: Yup.string().required(),
        });

        if (!(await esquema.isValid(req.body))) {
            return res.status(400).json({ erro: 'Erro de validação.' });
        }

        const { email, senha } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(401).json({ erro: 'Usuário não encontrado.' });
        }

        if (!(await usuario.verificarSenha(senha))) {
            return res.status(401).json({ erro: 'Senha incorreta.' });
        }

        const { id, nome } = usuario;

        return res.json({
            usuario: {
                id,
                nome,
                email,
            },
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new SessaoController();
