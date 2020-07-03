import Sequelize, { Model } from 'sequelize';

class Agendamento extends Model {
	static init(sequelize) {
		super.init(
			{
				data: Sequelize.DATE,
				cancelado_em: Sequelize.DATE,
			},
			{
				sequelize,
			}
		);
		return this;
	}

	static associar(models) {
		this.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
		this.belongsTo(models.Usuario, {
			foreignKey: 'id_prestador',
			as: 'prestador',
		});
	}
}

export default Agendamento;
