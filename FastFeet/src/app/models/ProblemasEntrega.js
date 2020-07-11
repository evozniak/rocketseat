import Sequelize, { Model } from 'sequelize';

class ProblemasEntrega extends Model {
    static init(sequelize) {
        super.init(
            {
                id_encomenda: Sequelize.STRING,
                descricao: Sequelize.STRING,
            },
            {
                tableName: 'problemasEntregas',
                sequelize,
            }
        );
        return this;
    }

    static associar(models) {
        this.belongsTo(models.Encomenda, {
            foreignKey: 'id_encomenda',
            as: 'encomenda',
        });
    }
}

export default ProblemasEntrega;
