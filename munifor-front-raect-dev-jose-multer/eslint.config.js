//! ===============================================
//! ESLINT CONFIGURATION - Configuración de ESLint
//! ===============================================
//* Archivo de configuración ESLint para el proyecto React

//* Propósito:
//? Define las reglas de linting para mantener código limpio y consistente
//? Configura plugins para React Hooks y React Refresh
//? Ignora carpeta /dist de producción

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

/**
 * * Configuración de ESLint
 * ? Define reglas y extensiones para análisis estático de código
 *
 * Configuración incluye:
 * - globalIgnores: Ignora carpeta dist (compilación de producción)
 * - files: Aplica reglas a todos los archivos JS y JSX
 * - extends: Extiende configuraciones recomendadas de ESLint, React Hooks y React Refresh
 * - languageOptions: Configura ECMAScript 2020 con soporte para JSX
 * - rules: Reglas personalizadas del proyecto
 */
export default defineConfig([
  //? Ignora la carpeta dist en el linting
  globalIgnores(["dist"]),
  {
    //? Aplica configuración a todos los archivos JS y JSX
    files: ["**/*.{js,jsx}"],

    //? Extiende configuraciones recomendadas
    extends: [
      js.configs.recommended, //* Reglas básicas de JavaScript
      reactHooks.configs["recommended-latest"], //* Reglas para React Hooks (useEffect, useState, etc.)
      reactRefresh.configs.vite, //* Reglas para React Refresh en Vite (hot reload)
    ],

    //? Configuración del lenguaje y entorno
    languageOptions: {
      ecmaVersion: 2020, //* Versión de ECMAScript
      globals: globals.browser, //* Variables globales del navegador (window, document, etc.)
      parserOptions: {
        ecmaVersion: "latest", //* Sintaxis más reciente de JS
        ecmaFeatures: { jsx: true }, //? Habilita JSX
        sourceType: "module", //? Permite import/export
      },
    },

    //? Reglas personalizadas del proyecto
    rules: {
      //* Permite variables sin uso si comienzan con mayúscula o guion bajo
      //? Útil para componentes React sin uso directo o constantes globales
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
    },
  },
]);

//! ===============================================
//! TRADUCCIÓN DE CONSTANTES
//! ===============================================
/**
 * ESPAÑOL | INGLÉS
 * ----------------
 * globalIgnores = ignorar globalmente
 * files = archivos
 * extends = extender
 * languageOptions = opciones de lenguaje
 * ecmaVersion = versión de ECMAScript
 * globals = globales
 * parserOptions = opciones del parser
 * ecmaFeatures = características de ECMAScript
 * sourceType = tipo de fuente
 * rules = reglas
 * no-unused-vars = no variables sin uso
 * varsIgnorePattern = patrón de variables a ignorar
 */
