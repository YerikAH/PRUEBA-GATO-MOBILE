import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Usuarios',
      version: '1.0.0',
      description: 'API RESTful para la gestión de usuarios con autenticación JWT',
      contact: {
        name: 'Soporte',
        email: 'soporte@ejemplo.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    tags: [
      {
        name: 'Autenticación',
        description: 'Operaciones relacionadas con la autenticación de usuarios'
      },
      {
        name: 'Usuarios',
        description: 'Operaciones relacionadas con los usuarios'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

export const swaggerSpec = swaggerJSDoc(options); 