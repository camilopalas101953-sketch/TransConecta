import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const db = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Probar conexión
db.connect()
  .then(() => console.log("✅ Conexión exitosa a PostgreSQL (Docker)"))
  .catch(err => console.error("❌ Error al conectar con PostgreSQL:", err));
