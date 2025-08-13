import express from 'express';
import homeRoute from '../src/Routes/home.js';
import pessoaRoute from '../src/Routes/pessoa.js';
import adminRoute from '../src/Routes/admin.js';
import authRoute from '../src/Routes/auth.js';

const PORT =  process.env.PORT || 3000;
const app = express();
app.use(express.json()); // Para analisar corpos de requisição em formato JSON


//Get pelo node>express se conectando a base de dados criada com mysql2.
app.use(homeRoute);
app.use(pessoaRoute);
app.use(adminRoute);
app.use(authRoute);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
