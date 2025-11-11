//* ========================================
//* SCHEMA: TaskSchema (Zod)
//* ========================================
//* Propósito: Validación para asignación de equipo a tarea
//* Usado en: OperatorCreateTask.jsx
//* Valida:
//*   - equipo: ID de cuadrilla (ObjectId de MongoDB de 24 caracteres hex)
//* Nota: Este schema solo valida el ID, otros campos de tarea
//*       se manejan directamente en el formulario

import z from "zod";

const taskSchema = z.object({
  //* Equipo: ID de la cuadrilla asignada
  //* Debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)
  equipo: z
    .string()
    .min(1, "Debes asignar un equipo")
    .regex(
      /^[a-f0-9]{24}$/,
      "ID de equipo inválido (debe ser ObjectId de MongoDB)"
    ),
});

export default taskSchema;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * taskSchema = esquema de tarea
 * equipo = equipo / cuadrilla
 */
