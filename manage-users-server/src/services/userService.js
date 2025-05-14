import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const userService = {
  /**
   * Registra un nuevo usuario
   * @param {Object} userData - Datos del usuario a registrar
   * @returns {Promise<Object>} - Usuario registrado (sin la contraseña)
   */
  async register(userData) {
    const { email, password, passwordConfirmation, ...rest } = userData;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email }
    });

    if (existingUser) {
      const error = new Error('El correo electrónico ya está en uso');
      error.statusCode = 400;
      throw error;
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const newUser = await prisma.usuario.create({
      data: {
        email,
        password: hashedPassword,
        ...rest
      }
    });

    // Excluir la contraseña de la respuesta
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  /**
   * Autentica a un usuario
   * @param {string} email - Correo electrónico del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} - Token JWT y datos del usuario (sin la contraseña)
   */
  async login(email, password) {
    // Buscar el usuario por email
    const user = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!user) {
      const error = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }

    // Verificar si la cuenta está activa
    if (!user.active) {
      const error = new Error('La cuenta está desactivada');
      error.statusCode = 403;
      throw error;
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // Excluir la contraseña de la respuesta
    const { password: _, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword
    };
  },

  /**
   * Obtiene todos los usuarios con paginación
   * @param {number} page - Número de página
   * @param {number} limit - Límite de resultados por página
   * @returns {Promise<Object>} - Lista de usuarios y metadatos de paginación
   */
  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    // Obtener el total de usuarios
    const total = await prisma.usuario.count();

    // Obtener los usuarios con paginación
    const users = await prisma.usuario.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        active: true,
        avatar: true,
        dni: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  },

  /**
   * Obtiene un usuario por su ID
   * @param {string} id - ID del usuario
   * @returns {Promise<Object>} - Usuario encontrado (sin la contraseña)
   */
  async findById(id) {
    const user = await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        active: true,
        avatar: true,
        dni: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    return user;
  },

  /**
   * Actualiza los datos de un usuario
   * @param {string} id - ID del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<Object>} - Usuario actualizado (sin la contraseña)
   */
  async update(id, userData) {
    // Verificar si el usuario existe
    const existingUser = await prisma.usuario.findUnique({
      where: { id }
    });

    if (!existingUser) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    // Actualizar el usuario
    const updatedUser = await prisma.usuario.update({
      where: { id },
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        active: true,
        avatar: true,
        dni: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return updatedUser;
  },

  /**
   * Actualiza el estado de un usuario
   * @param {string} id - ID del usuario
   * @param {boolean} active - Nuevo estado
   * @returns {Promise<Object>} - Usuario actualizado (sin la contraseña)
   */
  async updateStatus(id, active) {
    // Verificar si el usuario existe
    const existingUser = await prisma.usuario.findUnique({
      where: { id }
    });

    if (!existingUser) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    // Actualizar el estado
    const updatedUser = await prisma.usuario.update({
      where: { id },
      data: { active },
      select: {
        id: true,
        name: true,
        email: true,
        active: true,
        avatar: true,
        dni: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return updatedUser;
  },

  /**
   * Elimina un usuario
   * @param {string} id - ID del usuario
   * @returns {Promise<void>}
   */
  async delete(id) {
    // Verificar si el usuario existe
    const existingUser = await prisma.usuario.findUnique({
      where: { id }
    });

    if (!existingUser) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    // Eliminar el usuario
    await prisma.usuario.delete({
      where: { id }
    });
  }
}; 