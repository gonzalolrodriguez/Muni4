//* ========================================
//* SCHEMA: LoginSchema (Zod)
//* ========================================
//* Propósito: Validación del formulario de inicio de sesión
//* Usado en: Login.jsx con React Hook Form
//* Valida:
//*   - username: Obligatorio (no vacío)
//*   - password: Obligatorio (no vacío)
//* Nota: La validación real de credenciales se hace en el backend

import { z } from "zod";

const loginSchema = z.object({
  //* Username: Campo obligatorio
  username: z.string().min(1, { message: "El username es requerido" }),

  //* Password: Campo obligatorio
  password: z.string().min(1, { message: "La contraseña es requerida" }),
});

export default loginSchema;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * loginSchema = esquema de inicio de sesión
 * username = nombre de usuario
 * password = contraseña
 * message = mensaje
 */
