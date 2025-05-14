import { userService } from '../services/userService.js';

export const authController = {
  /**
   * Registra un nuevo usuario
   * @route POST /auth/register
   */
  async register(req, res) {
    try {
      const userData = req.body;
      const newUser = await userService.register(userData);

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: newUser
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error al registrar usuario'
      });
    }
  },

  /**
   * Autentica a un usuario
   * @route POST /auth/login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { token, user } = await userService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: { token, user }
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error al iniciar sesión'
      });
    }
  }
}; 