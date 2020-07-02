import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Usuario extends Model {
	static init(sequelize) {
		super.init(
			{
				nome: Sequelize.STRING,
				email: Sequelize.STRING,
				senha: Sequelize.VIRTUAL,
				senha_hash: Sequelize.STRING,
				fornecedor: Sequelize.BOOLEAN,
			},
			{
				sequelize,
			}
		);
		this.addHook('beforeSave', async (usuario) => {
			if (usuario.senha) {
				usuario.senha_hash = await bcrypt.hash(usuario.senha, 8);
			}
		});
		return this;
	}

	static associar(models) {
		console.log(models);
		this.belongsTo(models.Arquivo, { foreignKey: 'id_avatar' });
	}

	verificarSenha(senha) {
		return bcrypt.compare(senha, this.senha_hash);
	}
}

export default Usuario;
