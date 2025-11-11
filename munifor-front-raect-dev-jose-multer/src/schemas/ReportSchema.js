//* ========================================
//* SCHEMA: ReportSchema (Zod)
//* ========================================
//* Propósito: Validación del formulario de reportes ciudadanos
//* Usado en: CitizenReports.jsx con React Hook Form
//* Valida:
//*   - title: Mínimo 5, máximo 100 caracteres
//*   - description: Mínimo 10, máximo 500 caracteres
//*   - type_report: Obligatorio (Bache, Alumbrado, Basura, Incidente, Otro)
//*   - other_type_detail: Obligatorio SOLO si type_report es "Otro"
//*   - image: Opcional (validación de archivos en ImageUploader)
//* Validación especial: refine() valida lógica condicional

import z from "zod";

const reportSchema = z
  .object({
    //* Campo: Título del reporte
    //* Validaciones: requerido, mínimo 5 chars, máximo 100 chars
    title: z
      .string()
      .min(1, "El título es requerido")
      .min(5, "El título debe tener al menos 5 caracteres")
      .max(100, "El título no puede exceder 100 caracteres"),

    //* Campo: Descripción del reporte
    //* Validaciones: requerido, mínimo 10 chars, máximo 500 chars
    description: z
      .string()
      .min(1, "La descripción es requerida")
      .min(10, "La descripción debe tener al menos 10 caracteres")
      .max(500, "La descripción no puede exceder 500 caracteres"),

    //* Campo: Tipo de reporte
    //* Validaciones: requerido, debe ser una de las opciones del select
    type_report: z.string().min(1, "Debe seleccionar un tipo de reporte"),

    //* Campo: Especificación cuando type_report es "Otro"
    //* Validaciones: opcional, pero obligatorio si type_report === "Otro"
    other_type_detail: z.string().optional(),

    //* Campo: Imágenes (opcional)
    //* Nota: La validación real se hace en ImageUploader.jsx
    image: z.any().optional(),
  })
  //* ========================================
  //* VALIDACIÓN CONDICIONAL
  //* ========================================
  //! refine(): Validación personalizada para lógica condicional
  //* Si type_report es "Otro", other_type_detail es OBLIGATORIO
  .refine(
    (data) => {
      //? Si type_report es "Otro" y other_type_detail está vacío, falla
      if (
        data.type_report === "Otro" &&
        (!data.other_type_detail || data.other_type_detail.trim().length === 0)
      ) {
        return false; // Validación falla
      }
      return true; // Validación pasa
    },
    {
      message: "Debe especificar el tipo de reporte", // Mensaje de error
      path: ["other_type_detail"], // Campo donde aparece el error
    }
  );

export default reportSchema;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * reportSchema = esquema de reporte
 * title = título
 * description = descripción
 * type_report = tipo de reporte
 * other_type_detail = detalle de otro tipo
 * image = imagen
 * data = datos
 * message = mensaje
 * path = ruta / camino
 */
