import express, { json } from 'express';
import path from 'path';
import routes from './routes';

import './database';

class App {
	constructor() {
		this.server = express();
		this.middlewares();
		this.routes();
	}

	middlewares() {
		this.server.use(json());
		this.server.use(
			'/arquivos/',
			express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
		);
	}

	routes() {
		this.server.use(routes);
	}
}

export default new App().server;