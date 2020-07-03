import Usuario from '../models/Usuario';
import Arquivo from '../models/Arquivo';

class PrestadorController {
	async index(req, res) {
		const prestadores = await Usuario.findAll({
			where: { prestador: true },
			attributes: ['id', 'nome', 'email', 'id_avatar'],
			include: [
				{
					model: Arquivo,
					as: 'avatar',
					attributes: ['nome', 'caminho', 'url'],
				},
			],
		});

		return res.json(prestadores);
	}
}

export default new PrestadorController();
