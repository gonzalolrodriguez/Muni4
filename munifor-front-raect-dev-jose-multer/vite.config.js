//! ===============================================
//! VITE CONFIGURATION - Configuración de Vite
//! ===============================================
//* Archivo de configuración Vite para el proyecto React

//* Propósito:
//? Configura el bundler Vite para desarrollo y producción
//? Define plugins: React (con SWC) y Tailwind CSS
//? Optimiza el desarrollo con hot module replacement (HMR)

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

/**
 * * Configuración de Vite
 * ? Define el entorno de desarrollo y producción para la aplicación React
 *
 * Plugins utilizados:
 * - @vitejs/plugin-react-swc: Plugin de React con compilador SWC (más rápido que Babel)
 * - @tailwindcss/vite: Plugin de Tailwind CSS para procesamiento de estilos
 *
 * Características:
 * - Hot Module Replacement (HMR): Actualización en caliente sin recargar página
 * - SWC: Compilador ultrarrápido de TypeScript/JSX escrito en Rust
 * - Tailwind CSS: Framework de utilidades CSS integrado
 * - Optimización de producción: Tree-shaking y minificación automática
 *
 * Comandos:
 * - npm run dev: Inicia servidor de desarrollo (puerto 5173 por defecto)
 * - npm run build: Compila para producción en carpeta /dist
 * - npm run preview: Vista previa de compilación de producción
 */
export default defineConfig({
  plugins: [
    react(), //* Plugin React con SWC para JSX y hot reload
    tailwindcss(), //* Plugin Tailwind CSS para procesamiento de estilos utilitarios
  ],
});

//! ===============================================
//! TRADUCCIÓN DE CONSTANTES
//! ===============================================
/**
 * ESPAÑOL | INGLÉS
 * ----------------
 * defineConfig = definir configuración
 * plugins = complementos/extensiones
 * react = plugin de React
 * tailwindcss = plugin de Tailwind CSS
 * dev = desarrollo
 * build = compilar/construir
 * preview = vista previa
 */
