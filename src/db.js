import 'dotenv/config';
import fs from 'fs';
import fsp from 'fs/promises' ;
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements:true
};

const dbInfo = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements:true
}
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

export async function runSqlFile(connection, filePath) {
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
    
        //Cria database de fato com ddl
        await runSqlFile(connection,caminho); 


        //cria superusuário padrão caso nao exista
        const supUser = await connection.execute(`SELECT * FROM Pessoa WHERE cpf = "00000000000";`)
        if(supUser[0].length == 0){
            //cria senha_hash do superusuario
            
            const senha_hash = await bcrypt.hash("123321", 10)
            const cpf_super = "00000000000"

            await connection.execute(`INSERT INTO Pessoa (nome, cpf, email, senha_hash) VALUES (?,?,?,?)`,['super',cpf_super,'super@super.com',senha_hash])
            console.log('SuperUsuárioCriado')

            const [queryIdPessoaSuper] = await connection.execute(`SELECT id_pessoa FROM Pessoa WHERE cpf = "00000000000";`);
            const idPessoaSuper = queryIdPessoaSuper[0].id_pessoa
            
            
            //Faz do superusuario admin        
            await connection.execute(`INSERT INTO Administrador (id_pessoa) VALUES (?)`,[idPessoaSuper])
            console.log('SuperUsuário se tornou admin')
            console.log("Logue no app e cadastre outros funcionários usando o superusuário: email: super@super.com senha: 123321")
        }

        //await connection.end()

    } catch (error) {
        console.error('Erro ao conectar ou criar o banco de dados:', error.message);
        if (connection) {
            await connection.end();
        }
    } 
}

createDatabase();

export async function getConnection() {
    try {
        const connection = await mysql.createConnection(dbInfo);       
        return connection;
    } catch (error) {
        console.error('Erro ao exportar conexão ao banco de dados', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    } 
}
