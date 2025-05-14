import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../utils/validations.js';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - passwordConfirmation
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario (mínimo 8 caracteres)
 *               passwordConfirmation:
 *                 type: string
 *                 format: password
 *                 description: Confirmación de la contraseña (debe coincidir con la contraseña)
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
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error de validación o correo ya registrado
 *       500:
 *         description: Error del servidor
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 *       403:
 *         description: Cuenta desactivada
 *       500:
 *         description: Error del servidor
 */
router.post('/login', validate(loginSchema), authController.login);

export default router; 