import express from 'express';
import { db } from './config/db.js';
import bcrypt from 'bcryptjs';
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import roleRoutes from "./routes/role.routes.js";



const app = express();
app.use(express.json());

// RUTA PRINCIPAL PARA QUE NO SALGA "Cannot GET /"
app.get('/', (req, res) => {
    res.send("Bienvenido a la API de TransConecta 🚀");
});

// Endpoint para probar la conexión con Docker/PostgreSQL
app.post('/api/test-db', async (req, res) => {
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

// Helper: validación de email simple
function isValidEmail(email) {
    const re = /^\S+@\S+\.\S+$/;
    return re.test(email);
}

// Crear usuario (DEBE SER POST, NO GET)
app.post('/api/usuarios', async (req, res) => {
    try {
        const { nombre_usuario, correo, contraseña, estado } = req.body;

        // Validaciones
        if (!nombre_usuario || !correo || !contraseña) {
            return res.status(400).json({ error: 'Faltan campos requeridos: nombre_usuario, correo o contraseña' });
        }

        if (typeof nombre_usuario !== 'string' || nombre_usuario.length > 100) {
            return res.status(400).json({ error: 'nombre_usuario inválido' });
        }

        if (!isValidEmail(correo) || correo.length > 100) {
            return res.status(400).json({ error: 'correo inválido' });
        }

        const estadoNormalized = estado ? estado.toString().toLowerCase() : 'activo';
        if (!['activo', 'inactivo'].includes(estadoNormalized)) {
            return res.status(400).json({ error: "estado debe ser 'activo' o 'inactivo'" });
        }

        // Hashear contraseña
        const hashed = await bcrypt.hash(contraseña, 10);

        const insertQuery = `
            INSERT INTO Usuario (nombre_usuario, correo, "contraseña", estado)
            VALUES ($1, $2, $3, $4)
            RETURNING id_usuario, nombre_usuario, correo, estado, fecha_creacion
        `;

        const values = [nombre_usuario, correo, hashed, estadoNormalized];

        const result = await db.query(insertQuery, values);
        const usuario = result.rows[0];

        res.status(201).json({ usuario });

    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'El correo ya está registrado' });
        }
        console.error('Error creando usuario:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

const PORT = process.env.PORT || 3000;
app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", roleRoutes);
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
});
