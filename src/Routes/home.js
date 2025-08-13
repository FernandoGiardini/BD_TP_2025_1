import express from 'express';
import { getConnection } from '../db.js';

const router = express.Router();

router.get('/', async (req,res) => {
    const conn = await getConnection();

    const [result] = await conn.execute(`SHOW TABLES`)


    
    res.json(result);
    await conn.end();
});

export default router;