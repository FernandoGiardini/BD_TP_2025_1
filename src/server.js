//Configurações e imports.
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise'); 

const PORT = 3000;
const app = express();
app.use(express.json()); // Para analisar corpos de requisição em formato JSON

const databaseName = process.env.DB_DATABASE || 'SistemaPonto';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: databaseName
};

//Criação da base de dados local.
async function createDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Conexão bem-sucedida ao servidor MySQL.');

    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
    console.log(`Banco de dados '${databaseName}' criado ou já existente.`);

    await connection.end();
  } catch (error) {
    console.error('Erro ao conectar ou criar o banco de dados:', error.message);
    if (connection) {
      await connection.end();
    }
  }
}

createDatabase();

//Get pelo node>express se conectando a base de dados criada com mysql2.

app.get('/', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(`SHOW TABLES;`); //destructuring para pegar apenas o primeiro elemento do array (as linhas resposta da query) e ignorar os metadados. 
    connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Erro ao conectar ou executar a query:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});