import express from "express";
import {
  obtenerRoles,
  crearRol,
  obtenerRolPorId,
  actualizarRol,
  asignarRolAUsuario,
  obtenerUsuarioConRol,
  obtenerUsuariosConRoles,
  eliminarRol
} from "../controllers/role.controller.js";

const router = express.Router();

// Rutas para Roles
router.get("/roles", obtenerRoles);
router.post("/roles", crearRol);
router.get("/roles/:id_rol", obtenerRolPorId);
router.put("/roles/:id_rol", actualizarRol);
router.delete("/roles/:id_rol", eliminarRol);

// Rutas para Asignación de Roles a Usuarios
router.put("/usuarios/:id_usuario/rol", asignarRolAUsuario);
router.get("/usuarios/:id_usuario/con-rol", obtenerUsuarioConRol);
router.get("/usuarios/con-roles/todos", obtenerUsuariosConRoles);

export default router;
