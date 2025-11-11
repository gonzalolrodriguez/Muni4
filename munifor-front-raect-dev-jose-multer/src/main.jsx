//* ========================================
//* ARCHIVO: main.jsx
//* ========================================
//* Propósito: Punto de entrada de la aplicación React
//* Este archivo:
//*   - Monta la aplicación en el DOM (elemento #root en index.html)
//*   - Envuelve la app en StrictMode para detección de problemas
//*   - Importa estilos globales (index.css con Tailwind)
//* React 19 RC + Vite 7.1.7

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // Estilos globales (Tailwind CSS)
import App from "./App"; // Componente raíz con enrutamiento

//* createRoot: API de React 18+ para renderizado concurrente
//* document.getElementById('root'): Elemento del DOM donde se monta la app
createRoot(document.getElementById("root")).render(
  //* StrictMode: Modo estricto de React para ayudar a detectar:
  //* - Ciclos de vida obsoletos
  //* - Uso de APIs deprecadas
  //* - Efectos secundarios inesperados
  //* Solo afecta en desarrollo, no en producción
  <StrictMode>
    <App />
  </StrictMode>
);

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * StrictMode = modo estricto
 * createRoot = crear raíz
 * render = renderizar
 */
