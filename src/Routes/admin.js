import express from 'express';
import { getConnection } from '../db.js';

const router = express.Router();

router.get('/admins', async () => {
    const conn = await getConnection();

    const [result] = await conn.execute(`SELECT * FROM Administrador`)

    console.log(result);
    await conn.end();
});

export default router;