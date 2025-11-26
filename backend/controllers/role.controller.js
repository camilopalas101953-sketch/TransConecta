import { db } from "../config/db.js";

// Obtener todos los roles
export const obtenerRoles = async (req, res) => {
  try {
    const query = `SELECT * FROM Rol ORDER BY id_rol`;
    const result = await db.query(query);
    
    res.json({
      total: result.rows.length,
      roles: result.rows
    });
  } catch (error) {
    console.error("Error obteniendo roles:", error);
    res.status(500).json({ error: "Error al obtener roles" });
  }
};

// Crear un nuevo rol
export const crearRol = async (req, res) => {
  try {
    const { nombre_rol, descripcion } = req.body;

    // Validaciones
    if (!nombre_rol) {
      return res.status(400).json({ error: "nombre_rol es obligatorio" });
    }

    if (typeof nombre_rol !== 'string' || nombre_rol.length > 100) {
      return res.status(400).json({ error: "nombre_rol inválido (máximo 100 caracteres)" });
    }

    if (descripcion && typeof descripcion !== 'string' || descripcion?.length > 255) {
      return res.status(400).json({ error: "descripcion inválida (máximo 255 caracteres)" });
    }

    const query = `
      INSERT INTO Rol (nombre_rol, descripcion)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [nombre_rol, descripcion || null];

    const result = await db.query(query, values);
    const rol = result.rows[0];

    res.status(201).json({ 
      mensaje: "Rol creado exitosamente",
      rol 
    });
  } catch (error) {
    console.error("Error creando rol:", error);
    res.status(500).json({ error: "Error al crear rol" });
  }
};

// Obtener un rol por ID
export const obtenerRolPorId = async (req, res) => {
  try {
    const { id_rol } = req.params;

    if (!id_rol || isNaN(id_rol)) {
      return res.status(400).json({ error: "id_rol inválido" });
    }

    const query = `SELECT * FROM Rol WHERE id_rol = $1`;
    const result = await db.query(query, [id_rol]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error obteniendo rol:", error);
    res.status(500).json({ error: "Error al obtener rol" });
  }
};

// Actualizar rol
export const actualizarRol = async (req, res) => {
  try {
    const { id_rol } = req.params;
    const { nombre_rol, descripcion } = req.body;

    if (!id_rol || isNaN(id_rol)) {
      return res.status(400).json({ error: "id_rol inválido" });
    }

    // Validar que el rol existe
    const checkQuery = `SELECT * FROM Rol WHERE id_rol = $1`;
    const checkResult = await db.query(checkQuery, [id_rol]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }

    // Validaciones
    if (nombre_rol && (typeof nombre_rol !== 'string' || nombre_rol.length > 100)) {
      return res.status(400).json({ error: "nombre_rol inválido (máximo 100 caracteres)" });
    }

    if (descripcion && (typeof descripcion !== 'string' || descripcion.length > 255)) {
      return res.status(400).json({ error: "descripcion inválida (máximo 255 caracteres)" });
    }

    const query = `
      UPDATE Rol 
      SET nombre_rol = COALESCE($1, nombre_rol),
          descripcion = COALESCE($2, descripcion)
      WHERE id_rol = $3
      RETURNING *
    `;
    const values = [nombre_rol || null, descripcion || null, id_rol];

    const result = await db.query(query, values);
    const rolActualizado = result.rows[0];

    res.json({ 
      mensaje: "Rol actualizado exitosamente",
      rol: rolActualizado
    });
  } catch (error) {
    console.error("Error actualizando rol:", error);
    res.status(500).json({ error: "Error al actualizar rol" });
  }
};

// Asignar rol a un usuario
export const asignarRolAUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { id_rol } = req.body;

    // Validaciones
    if (!id_usuario || isNaN(id_usuario)) {
      return res.status(400).json({ error: "id_usuario inválido" });
    }

    if (!id_rol || isNaN(id_rol)) {
      return res.status(400).json({ error: "id_rol es obligatorio y debe ser válido" });
    }

    // Verificar que el usuario existe
    const userQuery = `SELECT * FROM Usuario WHERE id_usuario = $1`;
    const userResult = await db.query(userQuery, [id_usuario]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar que el rol existe
    const roleQuery = `SELECT * FROM Rol WHERE id_rol = $1`;
    const roleResult = await db.query(roleQuery, [id_rol]);

    if (roleResult.rows.length === 0) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }

    // Asignar rol al usuario
    const updateQuery = `
      UPDATE Usuario 
      SET id_rol = $1
      WHERE id_usuario = $2
      RETURNING id_usuario, nombre_usuario, correo, id_rol, estado, fecha_creacion
    `;
    const updateResult = await db.query(updateQuery, [id_rol, id_usuario]);
    const usuarioActualizado = updateResult.rows[0];

    res.json({ 
      mensaje: "Rol asignado exitosamente",
      usuario: usuarioActualizado
    });
  } catch (error) {
    console.error("Error asignando rol:", error);
    res.status(500).json({ error: "Error al asignar rol" });
  }
};

// Obtener usuario con detalles de rol
export const obtenerUsuarioConRol = async (req, res) => {
  try {
    const { id_usuario } = req.params;

    if (!id_usuario || isNaN(id_usuario)) {
      return res.status(400).json({ error: "id_usuario inválido" });
    }

    const query = `
      SELECT 
        u.id_usuario,
        u.nombre_usuario,
        u.correo,
        u.estado,
        u.fecha_creacion,
        r.id_rol,
        r.nombre_rol,
        r.descripcion
      FROM Usuario u
      LEFT JOIN Rol r ON u.id_rol = r.id_rol
      WHERE u.id_usuario = $1
    `;

    const result = await db.query(query, [id_usuario]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuario = result.rows[0];
    
    res.json({
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre_usuario: usuario.nombre_usuario,
        correo: usuario.correo,
        estado: usuario.estado,
        fecha_creacion: usuario.fecha_creacion,
        rol: usuario.id_rol ? {
          id_rol: usuario.id_rol,
          nombre_rol: usuario.nombre_rol,
          descripcion: usuario.descripcion
        } : null
      }
    });
  } catch (error) {
    console.error("Error obteniendo usuario con rol:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

// Obtener todos los usuarios con sus roles
export const obtenerUsuariosConRoles = async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id_usuario,
        u.nombre_usuario,
        u.correo,
        u.estado,
        u.fecha_creacion,
        r.id_rol,
        r.nombre_rol,
        r.descripcion
      FROM Usuario u
      LEFT JOIN Rol r ON u.id_rol = r.id_rol
      ORDER BY u.id_usuario
    `;

    const result = await db.query(query);

    const usuarios = result.rows.map(row => ({
      id_usuario: row.id_usuario,
      nombre_usuario: row.nombre_usuario,
      correo: row.correo,
      estado: row.estado,
      fecha_creacion: row.fecha_creacion,
      rol: row.id_rol ? {
        id_rol: row.id_rol,
        nombre_rol: row.nombre_rol,
        descripcion: row.descripcion
      } : null
    }));

    res.json({
      total: usuarios.length,
      usuarios
    });
  } catch (error) {
    console.error("Error obteniendo usuarios con roles:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// Eliminar rol (solo si no tiene usuarios asignados)
export const eliminarRol = async (req, res) => {
  try {
    const { id_rol } = req.params;

    if (!id_rol || isNaN(id_rol)) {
      return res.status(400).json({ error: "id_rol inválido" });
    }

    // Verificar que el rol no tiene usuarios asignados
    const checkQuery = `SELECT COUNT(*) FROM Usuario WHERE id_rol = $1`;
    const checkResult = await db.query(checkQuery, [id_rol]);
    const usuariosConRol = parseInt(checkResult.rows[0].count);

    if (usuariosConRol > 0) {
      return res.status(409).json({ 
        error: `No se puede eliminar el rol. Hay ${usuariosConRol} usuario(s) asignado(s) a este rol` 
      });
    }

    // Eliminar rol
    const deleteQuery = `DELETE FROM Rol WHERE id_rol = $1 RETURNING *`;
    const deleteResult = await db.query(deleteQuery, [id_rol]);

    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }

    res.json({ 
      mensaje: "Rol eliminado exitosamente",
      rol: deleteResult.rows[0]
    });
  } catch (error) {
    console.error("Error eliminando rol:", error);
    res.status(500).json({ error: "Error al eliminar rol" });
  }
};
