//* ========================================
//* SCHEMA: CrewSchema (Zod)
//* ========================================
//* Propósito: Validación del formulario de creación de cuadrillas
//* Usado en: OperatorCreateTeam.jsx
//* Valida:
//*   - nombre: Nombre de la cuadrilla (3-50 caracteres)
//*   - lider: ID del trabajador líder (ObjectId de MongoDB)
//*   - miembros: String con IDs separados por comas (opcional)
//* Nota: Los miembros son opcionales, pero si se proporcionan
//*       deben ser ObjectIds válidos separados por comas

import z from "zod";

const crewSchema = z.object({
  //* Nombre: Identificador de la cuadrilla
  nombre: z
    .string()
    .min(3, "El nombre del equipo debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres"),

  //* Líder: ID del trabajador que liderará la cuadrilla
  //* Debe ser un ObjectId válido de MongoDB (24 caracteres hex)
  lider: z
    .string()
    .min(1, "Debes asignar un líder")
    .regex(
      /^[a-f0-9]{24}$/,
      "ID de líder inválido (debe ser ObjectId de MongoDB)"
    ),

  //* Miembros: String con IDs separados por comas (opcional)
  //* Ejemplo: "507f1f77bcf86cd799439011,507f191e810c19729de860ea"
  //* Validación personalizada: cada ID debe ser ObjectId válido
  miembros: z.string().refine((val) => {
    //? Si está vacío, es válido (miembros es opcional)
    if (!val.trim()) return true;

    //* Separar por comas y validar cada ID
    const ids = val.split(",").map((id) => id.trim());
    return ids.every((id) => /^[a-f0-9]{24}$/.test(id));
  }, "Todos los IDs deben ser válidos (ObjectId de MongoDB)"),
});

export default crewSchema;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * crewSchema = esquema de cuadrilla
 * nombre = nombre
 * lider = líder / jefe
 * miembros = miembros / integrantes
 * val = valor
 * ids = identificadores
 * id = identificador
 */
