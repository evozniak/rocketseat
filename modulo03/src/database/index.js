import Sequelize from 'sequelize';

import Usuario from '../app/models/Usuario';
import Arquivo from '../app/models/Arquivo';
import Agendamento from '../app/models/Agendamento';

import databaseConfig from '../config/database';

const modelos = [Usuario, Arquivo, Agendamento];

class Database {
	constructor() {
		this.init();
	}

	init() {
		this.connection = new Sequelize(databaseConfig);

		modelos
			.map((model) => model.init(this.connection))
			.map((model) => model.associar && model.associar(this.connection.models));
	}
}

export default new Database();
