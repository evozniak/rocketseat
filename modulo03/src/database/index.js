import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import Usuario from '../app/models/Usuario';
import Arquivo from '../app/models/Arquivo';
import Agendamento from '../app/models/Agendamento';

import databaseConfig from '../config/database';

const modelos = [Usuario, Arquivo, Agendamento];

class Database {
	constructor() {
		this.init();
		this.mongo();
	}

	init() {
		this.connection = new Sequelize(databaseConfig);

		modelos
			.map((model) => model.init(this.connection))
			.map((model) => model.associar && model.associar(this.connection.models));
	}

	mongo() {
		this.mongoConnection = mongoose.connect(
			'mongodb://localhost:27017/gobarber',
			{ useNewUrlParser: true, useFindAndModify: true }
		);
	}
}

export default new Database();
