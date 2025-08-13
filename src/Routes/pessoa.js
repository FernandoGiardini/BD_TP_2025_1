import express from 'express';
import { getConnection } from '../db.js';

const router = express.Router();

router.get('/pessoas', async (req,res) => {
    const conn = await getConnection();

    const [result] = await conn.execute(`SELECT * FROM Pessoa`)

    await conn.end();
    
    res.json(result);
});

export default router;