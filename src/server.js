//Configurações / imports.
import 'dotenv/config';
import fs from 'fs';
import fsp from 'fs/promises' ;
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mysql from 'mysql2/promise';

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
//asserção de caminho para arquivo sql
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getFilePath(fileName, folder='sql'){
  const filePath = path.resolve(__dirname,folder,fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Arquivo SQL não encontrado: ${filePath}`);
  }

  return filePath;
}

const caminho = getFilePath("ddl.sql");

async function runSqlFile(connection, filePath) {
  try {
    const sql = await fsp.readFile(filePath, 'utf-8');

    // 3. Executa o conteúdo do arquivo (que pode conter múltiplos comandos)
    await connection.query(sql);
    
    console.log(`Arquivo SQL '${filePath}' executado com sucesso.`);
  } catch (error) {
    console.error(`Erro ao executar o arquivo SQL '${filePath}':`, error);
  }
}

//Criação da base de dados local.
async function createDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Conexão bem-sucedida ao servidor MySQL.');
    

    await runSqlFile(connection,caminho);

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