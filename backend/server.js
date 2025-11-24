import express from 'express';
import { db } from './config/db.js';

const app = express();
app.use(express.json());

// Endpoint para probar la conexión
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await db.query("SELECT NOW()");
        res.json({
            connected: true,
            time: result.rows[0].now
        });
    } catch (err) {
        res.status(500).json({ connected: false, error: err.message });
    }
});

app.listen(3000, () => {
    console.log("🚀 Servidor backend escuchando en http://localhost:3000");
});
