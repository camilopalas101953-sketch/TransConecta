TransConecta – Sistema Web de Gestión de Transporte y Control de Fatiga

Proyecto formativo del SENA
Desarrollado en JavaScript (Svelte + Node/Express + PostgreSQL en Docker)

📌 Descripción General

TransConecta es un sistema web diseñado para empresas de transporte especial, enfocado en la asignación segura de rutas, el control de horas de conducción, y la prevención de fatiga en los conductores.

El sistema valida automáticamente el cumplimiento de la normativa de descanso antes de permitir asignaciones, gestionando también vehículos, trayectos, usuarios y roles.

Este repositorio contiene los documentos de análisis, diseño y desarrollo del proyecto.

🎯 Objetivos del Sistema

Gestionar usuarios, conductores y vehículos.

Registrar horas de conducción y calcular descanso real.

Detectar automáticamente estados de fatiga.

Asignar rutas solo a conductores aptos.

Mantener historial y trazabilidad.

Proveer un panel administrativo claro y moderno.

Uso de colores y estilo visual definidos en prototipos:
#E53935 (rojo primario), #121212 (negro), #FFFFFF (blanco), #6E6E6E (gris).

🗺️ Mapa de Navegación – Módulos Principales
1️⃣ Autenticación

Login

Registro

Control por roles (admin, coordinador, conductor)

2️⃣ Dashboard

Indicadores principales:

Conductores activos

Vehículos disponibles

Asignaciones del día

Alertas de fatiga

3️⃣ Gestión de Conductores

Crear / editar conductores

Registrar horas de conducción

Historial completo

Estado de aptitud (descanso acumulado)

4️⃣ Gestión de Vehículos

Información y estado operativo

Documentos del vehículo

Historial de mantenimiento

5️⃣ Rutas y Asignaciones

CRUD de trayectos

Asignar conductor + vehículo + ruta

Validación automática de fatiga

Historial de asignaciones

6️⃣ Control de Fatiga

Consulta del descanso real

Alertas generadas

Conductores no aptos

7️⃣ Perfil del Conductor

Ver asignaciones

Registrar horas

Estado de descanso

🧩 Modelo Entidad–Relación (MER)

Incluye entidades principales:

usuario

rol / usuario_rol

conductor

vehiculo

trayecto

horas_conduccion

alerta_fatiga

vehiculo_conductor_trayecto

documento_vehiculo

historial_conductor

historial_vehiculo

El MER garantiza integridad y trazabilidad completa.

(Aquí en GitHub puedes agregar la imagen del MER como asset.)

⚙️ Tecnologías Utilizadas
Frontend

Svelte

HTML5 / CSS3

Fetch API

Backend

Node.js

Express

JWT (Autenticación)

Bcrypt (Hash de contraseñas)

Base de Datos

PostgreSQL

Docker (contenedor con volumen persistente)

Herramientas de desarrollo

Visual Studio Code

Git / GitHub

DBeaver para administración de la BD

🧱 Arquitectura del Proyecto
TransConecta/
├── frontend/      → Svelte
│   ├── src/
│   │   ├── routes/
│   │   ├── components/
│   │   ├── stores/
│   │   └── App.svelte
├── backend/       → Node.js + Express
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── config/
│   └── server.js
└── database/      → scripts SQL + MER

📚 Contenido del Repositorio

✔ Requisitos funcionales y no funcionales

✔ Especificación IEEE 830

✔ Diagramas UML:

Casos de uso

Clases

Secuencia

Actividad

✔ Diseño MER y scripts SQL

✔ Prototipos y mockups

✔ Código del frontend

✔ Código del backend

✔ Documentación técnica

🧪 Estado del Proyecto

Fase actual: Inicio del desarrollo
Módulo en construcción: Autenticación (Login + Registro)

📌 Autor

Wilfran Camilo Castellanos Palacio
Programa: Análisis y Desarrollo de Software – SENA