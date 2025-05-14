import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  try {
    // Obtener el token del header de autorización
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado. Token no proporcionado o formato inválido'
      });
    }

    // Extraer el token
    const token = authHeader.split(' ')[1];

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Agregar el usuario al objeto request
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'No autorizado. Token expirado'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'No autorizado. Token inválido'
    });
  }
}; 