//* ========================================
//* SCHEMA: UpdatePasswordSchema (Zod)
//* ========================================
//* Propósito: Validación del formulario de actualización de contraseña
//* Usado en: UpdatePassword.jsx
//* Valida:
//*   - password: Nueva contraseña (8-50 chars, mayúscula, minúscula, número)
//*   - confirmpassword: Confirmación (debe coincidir con password)
//* Reglas de seguridad:
//*   - Mínimo 8 caracteres
//*   - Al menos 1 mayúscula
//*   - Al menos 1 minúscula
//*   - Al menos 1 número

import z from "zod";

const updatePasswordShema = z
  .object({
    //* Password: Nueva contraseña con requisitos de seguridad
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(50, "La contraseña no puede tener más de 50 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/,
        "Debe contener al menos una mayúscula, una minúscula y un número"
      ),

    //* Confirmación de password
    confirmpassword: z.string().min(1, "Confirma tu contraseña"),
  })
  //* ========================================
  //* VALIDACIÓN CONDICIONAL
  //* ========================================
  //! refine(): Verificar que ambas contraseñas coincidan
  .refine((data) => data.password === data.confirmpassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmpassword"], // Error aparece en confirmpassword
  });

export default updatePasswordShema;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * updatePasswordShema = esquema de actualizar contraseña (typo: debería ser Schema)
 * password = contraseña
 * confirmpassword = confirmar contraseña
 * data = datos
 * message = mensaje
 * path = ruta / camino
 */
