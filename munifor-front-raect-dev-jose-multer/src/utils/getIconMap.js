//* ========================================
//* UTILIDAD: getIconMap
//* ========================================
//* Propósito: Generar iconos personalizados para marcadores de Leaflet
//* Crea iconos en forma de gota (marcador de mapa) con:
//*   - Color según tipo (bache, alumbrado, basura, etc.)
//*   - Borde según estado (pendiente, aceptado, completado, etc.)
//*   - Emoji según tipo
//* Usado en: GlobalLeafletMap, CitizenLeafletMap, ReportLeafletMap
//* Funciones:
//*   - getIconReport: Iconos para reportes ciudadanos
//*   - getIconTask: Iconos para tareas
//*   - getIconProgress: Iconos para reportes de progreso

import L from "leaflet";
import { ICONS } from "./icons";

//* ========================================
//* FUNCIÓN: getIconReport
//* ========================================
//* Propósito: Crear icono para marcador de reporte
//* @param {String} type - Tipo de reporte (bache, alumbrado, basura, otro)
//* @param {String} status - Estado del reporte (pendiente, revisado, aceptado, completado, rechazado)
//* @returns {L.DivIcon} - Icono de Leaflet personalizado
export const getIconReport = (type, status) => {
  //* Mapa de colores según tipo de reporte
  const typeColorMap = {
    bache: "#e74c3c", // rojo - peligro
    alumbrado: "#f39c12", // naranja - atención
    basura: "#27ae60", // verde - limpieza
    otro: "#9333ea", // violeta - general
  };

  //* Mapa de colores para el borde según estado
  const statusColorMap = {
    pendiente: "#f59e42", // naranja
    revisado: "#3b82f6", // azul
    aceptado: "#22c55e", // verde
    completado: "#10b981", // verde más fuerte
    rechazado: "#ef4444", // rojo
  };

  //* L.divIcon: Crear icono HTML personalizado
  return L.divIcon({
    //* HTML del icono: forma de gota con emoji
    html: `
      <div style="position: relative; width: 40px; height: 50px;">
        <div style="background:${typeColorMap[type]}; 
                    width: 40px; 
                    height: 40px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    display:flex; 
                    align-items:center; 
                    justify-content:center;
                    border:3px solid ${statusColorMap[status]};
                    box-shadow: 0 3px 8px rgba(0,0,0,0.3);">
          <span style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">${ICONS[type]}</span>
        </div>
      </div>
    `,
    className: "", // Sin clase CSS adicional
    iconSize: [40, 50], // Tamaño del icono
    iconAnchor: [20, 50], // Punto de anclaje (centro inferior)
    popupAnchor: [0, -50], // Posición del popup
  });
};

//* ========================================
//* FUNCIÓN: getIconTask
//* ========================================
//* Propósito: Crear icono para marcador de tarea
//* @param {String} type - Tipo de tarea (reparación, mantenimiento, recolección, supervisión)
//* @param {String} priority - Prioridad (alta, media, baja)
//* @returns {L.DivIcon} - Icono de Leaflet personalizado
export const getIconTask = (type, priority) => {
  //* Mapa de colores según tipo de tarea
  const typeColorMap = {
    reparación: "#e74c3c", // rojo - alta prioridad
    mantenimiento: "#f39c12", // naranja - media prioridad
    recolección: "#27ae60", // verde - baja prioridad
    supervisión: "#9333ea", // violeta - general
  };

  //* Mapa de colores para el borde según prioridad
  const priorityColorMap = {
    alta: "#e74c3c", // rojo - alta prioridad
    media: "#f39c12", // naranja - media prioridad
    baja: "#27ae60", // verde - baja prioridad
  };

  return L.divIcon({
    html: `
      <div style="position: relative; width: 40px; height: 50px;">
        <div style="background:${typeColorMap[type]}; 
                    width: 40px; 
                    height: 40px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    display:flex; 
                    align-items:center; 
                    justify-content:center;
                    border:3px solid ${priorityColorMap[priority]};
                    box-shadow: 0 3px 8px rgba(0,0,0,0.3);">
          <span style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">${ICONS[type]}</span>
        </div>
      </div>
    `,
    className: "",
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });
};

//* ========================================
//* FUNCIÓN: getIconProgress
//* ========================================
//* Propósito: Crear icono para marcador de reporte de progreso
//* @param {String} status - Estado (pendiente, en progreso, finalizado)
//* @returns {L.DivIcon} - Icono de Leaflet personalizado
export const getIconProgress = (status) => {
  //* Mapa de colores según estado del progreso
  const statusColorMap = {
    pendiente: "#f59e42", // naranja
    "en progreso": "#3b82f6", // azul
    finalizado: "#10b981", // verde más fuerte
  };

  return L.divIcon({
    html: `
      <div style="position: relative; width: 40px; height: 50px;">
        <div style="background:${statusColorMap[status]}; 
                    width: 40px; 
                    height: 40px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    display:flex; 
                    align-items:center; 
                    justify-content:center;
                    border:3px solid white;
                    box-shadow: 0 3px 8px rgba(0,0,0,0.3);">
          <span style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">${ICONS.progress}</span>
        </div>
      </div>
    `,
    className: "",
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });
};

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * type = tipo
 * status = estado
 * priority = prioridad
 * typeColorMap = mapa de colores por tipo
 * statusColorMap = mapa de colores por estado
 * priorityColorMap = mapa de colores por prioridad
 * getIconReport = obtener icono de reporte
 * getIconTask = obtener icono de tarea
 * getIconProgress = obtener icono de progreso
 * iconSize = tamaño del icono
 * iconAnchor = ancla del icono
 * popupAnchor = ancla del popup
 */
