import express from 'express';
import bcrypt from 'bcrypt';
import { getConnection } from '../db.js';//CADASTRO
import router from './home.js';

router.post('/register', async (req, res) => {
    
    if(req.body == undefined){
        return res.status(400).json({ error: 'Campos de registro são obrigatórios' });
    }

    const { nome, cpf, email, senha } = req.body;

    if (!nome || !cpf || !email || !senha) return res.status(400).json({ error: 'Todos os campos são obrigatórios' });

    try {
    const connection = await getConnection();

    // Cria hash da senha
    const saltRounds = 10;
    const senha_hash = await bcrypt.hash(senha, saltRounds);

    await connection.execute(
        `INSERT INTO Pessoa (nome, cpf,email, senha_hash) VALUES (?, ?, ?, ?)`,
        [nome, cpf, email, senha_hash]
    );

    await connection.end();
    res.json({ message: 'Usuário registrado com sucesso' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;