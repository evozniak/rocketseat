import Sequelize, { Model } from 'sequelize';

class Destinatario extends Model {
    static init(sequelize) {
        super.init(
            {
                nome: Sequelize.STRING,
                rua: Sequelize.STRING,
                complemento: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );
        return this;
    }
}

export default Destinatario;
