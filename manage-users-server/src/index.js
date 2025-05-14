import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Importar middlewares
import { errorHandler } from './middlewares/errorHandler.js';

// Importar swagger
import { swaggerSpec } from './utils/swagger.js';

// Inicializar express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta de estado
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});

// Manejar errores no capturados
process.on('uncaughtException', (err) => {
  console.error('Error no capturado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Promesa rechazada no manejada:', err);
  process.exit(1);
}); 