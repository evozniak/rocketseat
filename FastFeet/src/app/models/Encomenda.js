import Sequelize, { Model } from 'sequelize';

class Encomenda extends Model {
    static init(sequelize) {
        super.init(
            {
                produto: Sequelize.STRING,
                cancelado_em: Sequelize.DATE,
                data_inicio: Sequelize.DATE,
                data_fim: Sequelize.DATE,
                created_at: Sequelize.DATE,
            },
            {
                sequelize,
            }
        );
        return this;
    }

    static associar(models) {
        this.belongsTo(models.Destinatario, {
            foreignKey: 'id_destinatario',
            as: 'destinatario',
        });
        this.belongsTo(models.Entregador, {
            foreignKey: 'id_entregador',
            as: 'entregador',
        });
        this.belongsTo(models.Arquivo, {
            foreignKey: 'id_assinatura',
            as: 'assinatura',
        });
    }
}

export default Encomenda;
