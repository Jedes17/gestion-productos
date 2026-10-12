## Instalación y ejecución

### 1. Requisitos previos

- Node.js y npm.
- XAMPP con MySQL.
- Un navegador web.

### 2. Configurar la base de datos

1. Iniciar MySQL desde XAMPP.
2. Abrir phpMyAdmin.
3. Importar el archivo `database/database.sql`.

El script crea la base de datos `productos` y la tabla `products`.

### 3. Configurar y ejecutar el backend

Abrir una terminal en la carpeta `backend`:

cd backend
npm install


Crear el archivo `backend/.env` con la configuración de la conexión a MySQL:

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=productos


Ajustar los valores según la configuración local de MySQL.

Iniciar el servidor:

npm run dev


El backend estará disponible en `http://localhost:3000`.

### 4. Configurar y ejecutar el frontend

Abrir una segunda terminal en la carpeta `frontend`:

cd frontend
npm install
npm run dev


Abrir en el navegador la dirección que indique Vite, normalmente `http://localhost:5173`.

**Importante:** mantener ambas terminales abiertas mientras se utiliza la aplicación.