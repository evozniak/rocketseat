const express = require('express');
const { json } = require('express');
const app = express();
app.use(express.json());

//"mock" para testes sem database.
let projetos = [{ id: "1", titulo: "Detalhe de implementação", tarefas: ["Nova tarefa"] }];
//Quantidade de requisições desde o start do node, controlado com middleware.
let qtdRequisicoes = 0;

//A biblioteca express irá escutar a porta 3001.
app.listen('3001', () => {
    console.log('Servidor ouvindo na porta 3001');
});

//Middleware GLOBAL para realizar a contagem de requisições e exibir no log.
//Obrigatório a inclusão em todos os endpoints.
function mdlContador(req, res, next) {
    qtdRequisicoes++;
    console.log(`Requisição Nº: ${qtdRequisicoes}, Método HTTP: ${req.method}.`);
    return next();
};

//Middleware para ser utilizado em endpoints precisam da validação do ID do projeto.
function mdlValidarSeProjExiste(req, res, next) {
    const { id } = req.params;
    if (!projetos[id]) {
        return res.status(400).json({ erro: `O Projeto ${id} não existe.` });
    }
    return next();
}

app.post('/projects', mdlContador, (req, res) => {
    const { id } = req.body;
    const { title } = req.body;
    const { tasks } = req.body;

    const projeto = {
        id: id,
        titulo: title,
        tarefas: tasks
    }

    projetos.push(projeto);
    return res.json(projeto);
});

app.get('/projects', mdlContador, (req, res) => {
    return res.json(projetos);
});

app.put('/projects/:id', mdlContador, mdlValidarSeProjExiste, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const { tasks } = req.body;

    const projeto = {
        id: id,
        titulo: title,
        tarefas: tasks
    }

    projetos[id] = projeto;

    return res.json(projeto);
});

app.delete('/projects/:id', mdlContador, mdlValidarSeProjExiste, (req, res,) => {
    const { id } = req.params;

    projetos.splice(id, 1);

    return res.send();
});

app.post('/projects/:id/tasks', mdlContador, mdlValidarSeProjExiste, (req, res) => {
    const { id } = req.params;
    const { task } = req.body;
    const projeto = projetos[id];

    projeto.tarefas.push(task);

    return res.json(projeto);
});