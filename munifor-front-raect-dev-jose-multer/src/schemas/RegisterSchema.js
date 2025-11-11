//* ========================================
//* SCHEMA: RegisterSchema (Zod)
//* ========================================
//* Propósito: Validación del formulario de registro de ciudadanos
//* Usado en: CitizenRegister.jsx con React Hook Form
//* Valida 11 campos con reglas específicas:
//*   1. username: 3-20 chars, solo alfanuméricos y guión bajo
//*   2. email: Formato de email válido
//*   3. password: 8-50 chars, mayúscula, minúscula y número
//*   4. confirmpassword: Debe coincidir con password
//*   5. first_name: 2-50 chars, solo letras y espacios
//*   6. last_name: 2-50 chars, solo letras y espacios
//*   7. address: 5-200 chars
//*   8. age: 18-100 años
//*   9. dni: Exactamente 8 dígitos
//*   10. sex: Hombre, Mujer, u Otro (obligatorio)
//*   11. phone: Exactamente 10 dígitos

import { z } from "zod";

const registerSchema = z
  .object({
    //* Username: alfanuméricos y guión bajo, 3-20 caracteres
    username: z
      .string()
      .min(3, "El username debe tener al menos 3 caracteres")
      .max(20, "El username no puede tener más de 20 caracteres")
      .regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guiones bajos"),

    //* Email: Formato válido de email
    email: z.string().min(1, "El email es requerido").email("Email inválido"),

    //* Password: 8-50 chars, debe incluir mayúscula, minúscula y número
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

    //* Nombre: 2-50 chars, solo letras (incluye acentos y ñ)
    first_name: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede tener más de 50 caracteres")
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras y espacios"),

    //* Apellido: 2-50 chars, solo letras (incluye acentos y ñ)
    last_name: z
      .string()
      .min(2, "El apellido debe tener al menos 2 caracteres")
      .max(50, "El apellido no puede tener más de 50 caracteres")
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras y espacios"),

    //* Dirección: 5-200 caracteres
    address: z
      .string()
      .min(5, "La dirección debe tener al menos 5 caracteres")
      .max(200, "La dirección no puede tener más de 200 caracteres"),

    //* Edad: 18-100 años (coerce convierte string a number)
    age: z.coerce
      .number()
      .min(18, "Debes tener al menos 18 años")
      .max(100, "Edad no válida"),

    //* DNI: Exactamente 8 dígitos numéricos
    dni: z.string().regex(/^\d{8}$/, "El DNI debe tener 8 dígitos"),

    //* Sexo: Enum con validación de no vacío
    sex: z
      .enum(["", "Hombre", "Mujer", "Otro"])
      .refine((val) => val !== "", { message: "Debes seleccionar tu sexo" }),

    //* Teléfono: Exactamente 10 dígitos
    phone: z.string().regex(/^\d{10}$/, "El teléfono debe tener 10 dígitos"),
  })
  //* ========================================
  //* VALIDACIÓN CONDICIONAL
  //* ========================================
  //! refine(): Verificar que password y confirmpassword coincidan
  .refine((data) => data.password === data.confirmpassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmpassword"], // Error aparece en confirmpassword
  });

export default registerSchema;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * registerSchema = esquema de registro
 * username = nombre de usuario
 * email = correo electrónico
 * password = contraseña
 * confirmpassword = confirmar contraseña
 * first_name = nombre
 * last_name = apellido
 * address = dirección
 * age = edad
 * dni = documento nacional de identidad
 * sex = sexo
 * phone = teléfono
 * data = datos
 * message = mensaje
 * path = ruta / camino
 */
