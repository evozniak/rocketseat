import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Agendamento extends Model {
	static init(sequelize) {
		super.init(
			{
				data: Sequelize.DATE,
				cancelado_em: Sequelize.DATE,
				passou: {
					type: Sequelize.VIRTUAL,
					get() {
						return isBefore(this.data, new Date());
					},
				},
				pode_cancelar: {
					type: Sequelize.VIRTUAL,
					get() {
						return isBefore(new Date(), subHours(this.data, 2));
					},
				},
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
