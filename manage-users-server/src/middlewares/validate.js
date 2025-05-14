import { ZodError } from 'zod';

/**
 * Middleware para validar datos con Zod
 * @param {import('zod').ZodSchema} schema - Esquema de validación
 * @param {'body' | 'query' | 'params'} source - Fuente de los datos a validar
 */
export const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const data = await schema.parseAsync(req[source]);
      req[source] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Error de validación',
          errors: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }
      next(error);
    }
  };
}; 