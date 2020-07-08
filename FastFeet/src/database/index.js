import Sequelize from 'sequelize';

import Destinatario from '../app/models/Destinatario';

import databaseConfig from '../config/database';
import Arquivo from '../app/models/Arquivo';
import Encomenda from '../app/models/Encomenda';
import Entregador from '../app/models/Entregador';
import Usuario from '../app/models/Usuario';

const modelos = [Destinatario, Arquivo, Encomenda, Entregador, Usuario];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);

        modelos
            .map((model) => model.init(this.connection))
            .map(
                (model) =>
                    model.associar && model.associar(this.connection.models)
            );
    }
}

export default new Database();
