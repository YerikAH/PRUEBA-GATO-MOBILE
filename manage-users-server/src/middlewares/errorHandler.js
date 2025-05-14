export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Verificar si es un error conocido con código de estado personalizado
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  // Determinar si incluir detalles del error en el modo de desarrollo
  const details = process.env.NODE_ENV === 'development' ? {
    stack: err.stack,
    ...(err.details ? { details: err.details } : {})
  } : undefined;

  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details })
  });
}; 