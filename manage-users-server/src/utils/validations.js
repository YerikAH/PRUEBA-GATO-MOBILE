import { z } from 'zod';

// Tamaño máximo del avatar en bytes (2MB)
const MAX_AVATAR_SIZE = parseInt(process.env.MAX_AVATAR_SIZE_MB || '2') * 1024 * 1024;

// Función para calcular el tamaño aproximado de un string base64
const calculateBase64Size = (base64String) => {
  // Eliminar metadatos si existen (ej: data:image/png;base64,)
  const base64Data = base64String.split(',')[1] || base64String;
  // Tamaño aproximado = (longitud de la cadena base64 * 3) / 4
  return Math.ceil((base64Data.length * 3) / 4);
};

// Esquema para el registro de usuario
export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  passwordConfirmation: z.string().min(1, 'La confirmación de contraseña es requerida'),
  avatar: z
    .string()
    .optional()
    .refine(
      (val) => !val || calculateBase64Size(val) <= MAX_AVATAR_SIZE,
      `El tamaño del avatar no puede exceder ${process.env.MAX_AVATAR_SIZE_MB || 2}MB`
    ),
  dni: z.string().optional(),
  active: z.boolean().optional().default(true)
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'Las contraseñas no coinciden',
  path: ['passwordConfirmation'],
});

// Esquema para el login
export const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(1, 'La contraseña es requerida')
});

// Esquema para actualizar perfil
export const updateUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  avatar: z
    .string()
    .optional()
    .refine(
      (val) => !val || calculateBase64Size(val) <= MAX_AVATAR_SIZE,
      `El tamaño del avatar no puede exceder ${process.env.MAX_AVATAR_SIZE_MB || 2}MB`
    ),
  dni: z.string().optional(),
  active: z.boolean().optional()
});

// Esquema para cambiar estado
export const updateUserStatusSchema = z.object({
  active: z.boolean()
});

// Esquema para paginación
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1))
    .refine((val) => val > 0, 'La página debe ser mayor a 0'),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10))
    .refine((val) => val > 0 && val <= 100, 'El límite debe estar entre 1 y 100')
}); 