import express from 'express';
import { getConnection } from '../db.js';

const router = express.Router();

router.get('/home', async () => {
    const conn = await getConnection();

    const [result] = await conn.execute(`SHOW TABLES`)

    console.log(result);
    await conn.end();
});

export default router;