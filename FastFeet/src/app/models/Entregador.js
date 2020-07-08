import Sequelize, { Model } from 'sequelize';

class Entregador extends Model {
    static init(sequelize) {
        super.init(
            {
                nome: Sequelize.STRING,
                email: Sequelize.STRING,
            },
            {
                tableName: 'entregadores',
                sequelize,
            }
        );
        return this;
    }

    static associar(models) {
        this.belongsTo(models.Arquivo, {
            foreignKey: 'id_avatar',
            as: 'avatar',
        });
    }
}

export default Entregador;
