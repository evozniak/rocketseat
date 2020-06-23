import Sequelize from 'sequelize';

import Usuario from '../app/models/Usuario';

import databaseConfig from '../config/database';

const modelos = [Usuario];

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
