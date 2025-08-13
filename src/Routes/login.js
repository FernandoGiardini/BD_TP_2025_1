import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getConnection } from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

//LOGIN
router.get('/login', async (req,res) => {

    if(req.body == undefined ){
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const { email, senha } = req.body;

    if ( !email || !senha ) return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    
    try{
        const conn = await getConnection();
        const [rows] = await conn.execute(`SELECT id_pessoa, senha_hash FROM Pessoa WHERE email = ?`,
        [email]);

        await conn.end();

        if (rows.length === 0) return res.status(401).json({ error: 'Credenciais inválidas' });

        const user = rows[0];
        const senhaValida = await bcrypt.compare(senha, user.senha_hash);

        if (!senhaValida) return res.status(401).json({ error: 'Credenciais inválidas' });
        
        const token = jwt.sign({ id_pessoa: user.id_pessoa }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    
});

export default router;