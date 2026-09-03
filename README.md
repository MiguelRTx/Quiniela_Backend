# Quinela Master - Backend

This is the backend of the "Quinela Master" project, a REST API developed with **Node.js** and **Express**.

## Main Technologies

- **Node.js** & **Express**
- **Sequelize** (ORM)
- **PostgreSQL** (Database)
- **Bcrypt** & **JSON Web Token (JWT)** (Authentication and security)
- **Zod** (Schema validation)
- **Node-cron** (Scheduled tasks)
- **Helmet** & **Cors** (Security and request configuration)

## Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

## Installation

1. Clone the repository or navigate to the backend folder:
   ```bash
   cd Quinela-Master-main
   ```

2. Install the necessary dependencies using npm:
   ```bash
   npm install
   ```

## Environment Configuration

Create a `.env` file in the root of this folder based on your environment configuration and local database. You will need to configure the PostgreSQL connection parameters, as well as the secret key for JWT.

Example of `.env`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=quinela_db
JWT_SECRET=your_super_secret_key
```

## Available Scripts

In the project directory, you can run the following commands:

### `npm run dev`

Starts the server in development mode using `nodemon`. The server will automatically restart if you make changes to the code.

### `npm start`

Starts the application for a production environment directly using node (`node src/server.js`).
