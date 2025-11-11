//* ========================================
//* UTILIDAD: formatDate
//* ========================================
//* Propósito: Formatear fechas al formato argentino (DD/MM/YYYY)
//* Zona horaria: America/Argentina/Cordoba (UTC-3)
//* Formato: 09/11/2025
//* Usado en: Todas las páginas que muestran fechas (reportes, tareas, etc.)
//* @param {String|Date} date - Fecha a formatear
//* @returns {String} - Fecha formateada o mensaje de error

export const formatDate = (date) => {
  //? Si no hay fecha, retornar mensaje por defecto
  if (!date) return "Fecha no disponible";

  //* Opciones de formateo para Intl.DateTimeFormat
  const opts = {
    day: "2-digit", // Día con 2 dígitos (01, 02, ..., 31)
    month: "2-digit", // Mes con 2 dígitos (01, 02, ..., 12)
    year: "numeric", // Año completo (2025)
    timeZone: "America/Argentina/Cordoba", // Zona horaria de Argentina
  };

  //* Intl.DateTimeFormat: API nativa de JS para formateo de fechas
  //* "es-AR": Locale español de Argentina
  //* new Date(date): Convierte string ISO a objeto Date
  return new Intl.DateTimeFormat("es-AR", opts).format(new Date(date));
};

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * date = fecha
 * opts = opciones
 * day = día
 * month = mes
 * year = año
 * timeZone = zona horaria
 * formatDate = formatear fecha
 */
