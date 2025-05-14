import { userService } from '../services/userService.js';

export const userController = {
  /**
   * Obtiene todos los usuarios con paginación
   * @route GET /users
   */
  async getAllUsers(req, res) {
    try {
      const { page, limit } = req.query;
      const result = await userService.findAll(page, limit);

      res.status(200).json({
        success: true,
        message: 'Usuarios obtenidos exitosamente',
        data: result.users,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener usuarios'
      });
    }
  },

  /**
   * Obtiene el perfil del usuario autenticado
   * @route GET /users/me
   */
  async getMyProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await userService.findById(userId);

      res.status(200).json({
        success: true,
        message: 'Perfil obtenido exitosamente',
        data: user
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error al obtener perfil'
      });
    }
  },

  /**
   * Obtiene un usuario por su ID
   * @route GET /users/:id
   */
  async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const user = await userService.findById(userId);

      res.status(200).json({
        success: true,
        message: 'Usuario obtenido exitosamente',
        data: user
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error al obtener usuario'
      });
    }
  },

  /**
   * Actualiza el perfil del usuario autenticado
   * @route PUT /users/me
   */
  async updateMyProfile(req, res) {
    try {
      const userId = req.user.id;
      const userData = req.body;
      const updatedUser = await userService.update(userId, userData);

      res.status(200).json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        data: updatedUser
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error al actualizar perfil'
      });
    }
  },

  /**
   * Actualiza un usuario por su ID
   * @route PUT /users/:id
   */
  async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const userData = req.body;
      const updatedUser = await userService.update(userId, userData);

      res.status(200).json({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: updatedUser
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error al actualizar usuario'
      });
    }
  },

  /**
   * Actualiza el estado del usuario autenticado
   * @route PATCH /users/me/status
   */
  async updateMyStatus(req, res) {
    try {
      const userId = req.user.id;
      const { active } = req.body;
      const updatedUser = await userService.updateStatus(userId, active);

      res.status(200).json({
        success: true,
        message: 'Estado actualizado exitosamente',
        data: updatedUser
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error al actualizar estado'
      });
    }
  },

  /**
   * Elimina el perfil del usuario autenticado
   * @route DELETE /users/me
   */
  async deleteMyProfile(req, res) {
    try {
      const userId = req.user.id;
      await userService.delete(userId);

      res.status(200).json({
        success: true,
        message: 'Perfil eliminado exitosamente'
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error al eliminar perfil'
      });
    }
  },

  /**
   * Elimina un usuario por su ID
   * @route DELETE /users/:id
   */
  async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      await userService.delete(userId);

      res.status(200).json({
        success: true,
        message: 'Usuario eliminado exitosamente'
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error al eliminar usuario'
      });
    }
  }
}; 