import { db } from "../config/db.js";
import bcrypt from "bcryptjs";

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre_usuario, correo, contraseña } = req.body;

    if (!nombre_usuario || !correo || !contraseña) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Verificar si el correo ya existe
    const existe = await db.query(
      "SELECT * FROM Usuario WHERE correo = $1",
      [correo]
    );

    if (existe.rows.length > 0) {
      return res.status(409).json({ error: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Insertar en la base de datos
    const query = `
      INSERT INTO Usuario (nombre_usuario, correo, "contraseña")
      VALUES ($1, $2, $3)
      RETURNING id_usuario, nombre_usuario, correo, estado, fecha_creacion
    `;

    const values = [nombre_usuario, correo, hashedPassword];

    const result = await db.query(query, values);

    return res.status(201).json({
      mensaje: "Usuario registrado con éxito",
      usuario: result.rows[0]
    });

  } catch (error) {
    console.error("Error registrando usuario:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};
