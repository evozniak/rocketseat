import Bee from 'bee-queue';
import EmailCancelamento from '../app/jobs/EmailCancelamento';
import redisConfig from '../config/redis';

const jobs = [EmailCancelamento];

class Queue {
	constructor() {
		this.filas = {};

		this.init();
	}

	init() {
		jobs.forEach(({ chave, processar }) => {
			this.filas[chave] = {
				bee: new Bee(chave, {
					redis: redisConfig,
				}),
				processar,
			};
		});
	}

	add(fila, job) {
		return this.filas[fila].bee.createJob(job).save();
	}

	processarFila() {
		jobs.forEach((job) => {
			const { bee, processar } = this.filas[job.chave];

			bee.on('failed', this.tratarErro).process(processar);
		});
	}

	tratarErro(job, err) {
		console.log(`Fila ${job.queue.name}: falhou`, err);
	}
}

export default new Queue();
