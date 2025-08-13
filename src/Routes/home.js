import express from 'express';
import { getConnection } from '../db.js';

const router = express.Router();

router.get('/', async (req,res) => {
    const conn = await getConnection();

    const [result] = await conn.execute(`SHOW TABLES`)

    await conn.end();
    
    res.json(result);
});

export default router;