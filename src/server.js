import express from 'express';
import homeRoute from './Routes/home.js';
import pessoaRoute from './Routes/pessoa.js';
import adminRoute from './Routes/admin.js';
import loginRoute from './Routes/login.js';
import cadastroRoute from './Routes/cadastro.js'

const PORT =  process.env.PORT || 3000;
const app = express();
app.use(express.json()); // Para analisar corpos de requisição em formato JSON


//Get pelo node>express se conectando a base de dados criada com mysql2.
app.use(homeRoute);
app.use(pessoaRoute);
app.use(adminRoute);
app.use(loginRoute);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
