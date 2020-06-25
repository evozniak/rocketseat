import Sequelize from 'sequelize';

import Destinatario from '../app/models/Destinatario';

import databaseConfig from '../config/database';

const modelos = [Destinatario];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);

        modelos.map((model) => model.init(this.connection));
    }
}

export default new Database();
