import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUsuario = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    // Validación de campos
    if (!correo || !contraseña) {
      return res.status(400).json({ error: "correo y contraseña son obligatorios" });
    }

    // Buscar al usuario en la base de datos
    const query = `SELECT * FROM Usuario WHERE correo = $1`;
    const result = await db.query(query, [correo]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "El correo no está registrado" });
    }

    const usuario = result.rows[0];

    // Comparar contraseñas (bcrypt)
    const coincide = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!coincide) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Crear el token JWT
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        correo: usuario.correo
      },
      "clave_secreta_super_segura",
      { expiresIn: "2h" }
    );

    return res.json({
      mensaje: "Inicio de sesión exitoso",
      descripcion: "Usuario autenticado correctamente",
      nombre_usuario: usuario.nombre_usuario,
      correo: usuario.correo,
      estado: usuario.estado,
      token
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
