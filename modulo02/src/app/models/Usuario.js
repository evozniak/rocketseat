import Sequelize, { Model } from 'sequelize';

class Usuario extends Model {
	static init(sequelize) {
		super.init(
			{
				nome: Sequelize.STRING,
				email: Sequelize.STRING,
				senha_hash: Sequelize.STRING,
				fornecedor: Sequelize.BOOLEAN,
			},
			{
				sequelize,
			}
		);
	}
}

export default Usuario;
