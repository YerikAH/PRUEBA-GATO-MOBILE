# API RESTful de Gestión de Usuarios

fdaslfkdsajl

API RESTful para gestión de usuarios con autenticación JWT, construida con Node.js, Express, PostgreSQL y Prisma.

## Requisitos previos

- Node.js (v14 o superior)
- Docker y Docker Compose
- npm o yarn

## Tecnologías utilizadas

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **PostgreSQL** - Base de datos
- **Prisma** - ORM
- **JWT** - Autenticación
- **Zod** - Validación de datos
- **Swagger** - Documentación de API

## Instalación

1. Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd manage-users-server
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/users_db?schema=public"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=users_db

# JWT
JWT_SECRET=tu_secreto_jwt_super_seguro
JWT_EXPIRES_IN=1d

# Limits
MAX_AVATAR_SIZE_MB=2
```

4. Iniciar la base de datos con Docker Compose:

```bash
docker-compose up -d
```

5. Ejecutar migraciones de Prisma:

```bash
npx prisma migrate dev
```

6. Generar cliente de Prisma:

```bash
npx prisma generate
```

## Ejecución

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3000`.

La documentación de la API estará disponible en `http://localhost:3000/api-docs`.

## Endpoints de la API

### Autenticación

- `POST /api/auth/register` - Registrar un nuevo usuario
- `POST /api/auth/login` - Iniciar sesión y obtener token JWT

### Usuarios

- `GET /api/users` - Obtener todos los usuarios (paginado)
- `GET /api/users/me` - Obtener perfil del usuario autenticado
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/me` - Actualizar perfil del usuario autenticado
- `PUT /api/users/:id` - Actualizar usuario por ID (futura implementación de admin)
- `PATCH /api/users/me/status` - Actualizar estado del usuario autenticado
- `DELETE /api/users/me` - Eliminar perfil del usuario autenticado
- `DELETE /api/users/:id` - Eliminar usuario por ID (futura implementación de admin)

## Modelo de Usuario

```prisma
model Usuario {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  active    Boolean  @default(true)
  avatar    String?
  dni       String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("usuarios")
}
```

## Validación de avatar

La API valida que los avatares en formato Base64 no excedan los 2MB. Si se proporciona un avatar que excede este tamaño, la API rechazará la solicitud con un error 400 Bad Request.
