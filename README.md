# Quinela Master - Backend

Este es el backend del proyecto "Quinela Master", una API REST desarrollada con **Node.js** y **Express**.

## Tecnologías principales

- **Node.js** & **Express**
- **Sequelize** (ORM)
- **PostgreSQL** (Base de datos)
- **Bcrypt** & **JSON Web Token (JWT)** (Autenticación y seguridad)
- **Zod** (Validación de esquemas)
- **Node-cron** (Tareas programadas)
- **Helmet** & **Cors** (Seguridad y configuración de peticiones)

## Requisitos previos

Asegúrate de tener instalado:
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

## Instalación

1. Clona el repositorio o ubícate en la carpeta del backend:
   ```bash
   cd Quinela-Master-main
   ```

2. Instala las dependencias necesarias usando npm:
   ```bash
   npm install
   ```

## Configuración del entorno

Crea un archivo `.env` en la raíz de esta carpeta basándote en la configuración de tu entorno y base de datos local. Necesitarás configurar los parámetros de conexión de PostgreSQL, así como la clave secreta para JWT.

Ejemplo de `.env`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=quinela_db
JWT_SECRET=tu_clave_secreta_super_segura
```

## Scripts disponibles

En el directorio del proyecto, puedes ejecutar los siguientes comandos:

### `npm run dev`

Inicia el servidor en modo de desarrollo utilizando `nodemon`. El servidor se reiniciará automáticamente si realizas cambios en el código.

### `npm start`

Inicia la aplicación para un entorno de producción utilizando directamente node (`node src/server.js`).
