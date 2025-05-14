import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { auth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { 
  updateUserSchema, 
  updateUserStatusSchema, 
  paginationSchema 
} from '../utils/validations.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(auth);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios (paginado)
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de resultados por página
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/', validate(paginationSchema, 'query'), userController.getAllUsers);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/me', userController.getMyProfile);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener un usuario por su ID
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', userController.getUserById);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Actualizar perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *               avatar:
 *                 type: string
 *                 description: URL o base64 del avatar del usuario
 *               dni:
 *                 type: string
 *                 description: Documento de identidad del usuario
 *               active:
 *                 type: boolean
 *                 description: Estado de la cuenta del usuario
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/me', validate(updateUserSchema), userController.updateMyProfile);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualizar un usuario por su ID
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *               avatar:
 *                 type: string
 *                 description: URL o base64 del avatar del usuario
 *               dni:
 *                 type: string
 *                 description: Documento de identidad del usuario
 *               active:
 *                 type: boolean
 *                 description: Estado de la cuenta del usuario
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', validate(updateUserSchema), userController.updateUser);

/**
 * @swagger
 * /users/me/status:
 *   patch:
 *     summary: Actualizar estado del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - active
 *             properties:
 *               active:
 *                 type: boolean
 *                 description: Nuevo estado del usuario
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.patch('/me/status', validate(updateUserStatusSchema), userController.updateMyStatus);

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Eliminar perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil eliminado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/me', userController.deleteMyProfile);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Eliminar un usuario por su ID
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', userController.deleteUser);

export default router; 