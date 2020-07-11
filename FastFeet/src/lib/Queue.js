import Bee from 'bee-queue';
import EmailNovaEntrega from '../app/jobs/EmailNovaEntrega';
import redisConfig from '../config/redis';
import EmailEncomendaCancelada from '../app/jobs/EmailEncomendaCancelada';

const jobs = [EmailNovaEntrega, EmailEncomendaCancelada];

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
