//* ========================================
//* PÁGINA: Home
//* ========================================
//* Propósito: Página de inicio para usuarios no autenticados
//* Ruta: / (ruta raíz)
//* Layout: GeneralLayout
//* Características:
//*   - Landing page del sistema
//*   - Accesible sin autenticación
//*   - TODO: Agregar contenido de bienvenida, información del municipio, etc.

import { Link } from "react-router-dom";
import Carousel from "../../components/Carousel";
import InfoCard from "../../components/InfoCard";
import logo from "../../assets/img/logo.jpg";

const Home = () => {
  return (
    <section className="flex flex-col items-center min-h-[70vh] bg-[#eaf4fe] text-gray-800 py-8 gap-8">
      {/* Carrousel informativo */}
      <div className="w-full max-w-2xl">
        <Carousel />
      </div>

      {/* Cards informativas */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <InfoCard
          icon={
            <span className="flex items-center justify-center w-12 h-12 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 40 40"
                fill="none"
                className="w-12 h-12"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                {/* Pantalla */}
                <rect
                  x="7"
                  y="10"
                  width="26"
                  height="16"
                  rx="3"
                  fill="#e0f7fa"
                  stroke="#1992c4"
                />
                {/* Base */}
                <rect
                  x="15"
                  y="28"
                  width="10"
                  height="2.5"
                  rx="1"
                  fill="#1992c4"
                  stroke="#1992c4"
                />
                {/* Engranaje */}
                <circle cx="32" cy="24" r="3" fill="#fff" stroke="#1992c4" />
                <path
                  d="M32 21.5v1M32 26.5v1M29.5 24h1M34.5 24h1M30.8 21.8l.7.7M33.5 24.5l.7.7M30.8 26.2l.7-.7M33.5 23.5l.7-.7"
                  stroke="#1992c4"
                  strokeWidth="0.7"
                />
              </svg>
            </span>
          }
          title="¿Qué es MuniFor?"
          desc="Una plataforma digital para gestionar reportes, tareas y avances municipales, conectando ciudadanos y municipio."
        />
        <InfoCard
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 40 40"
              fill="none"
              className="w-12 h-12 mx-auto"
              stroke="currentColor"
              strokeWidth="2"
            >
              {/* Persona central */}
              <circle cx="20" cy="14" r="5" />
              <path
                d="M10 32c0-4.418 4.03-8 10-8s10 3.582 10 8"
                strokeLinecap="round"
              />
              {/* Personas laterales */}
              <circle cx="10" cy="18" r="3.5" />
              <circle cx="30" cy="18" r="3.5" />
              <path d="M3 33c0-3.5 3.5-6.5 7-6.5" strokeLinecap="round" />
              <path d="M37 33c0-3.5-3.5-6.5-7-6.5" strokeLinecap="round" />
            </svg>
          }
          title="Participación Ciudadana"
          desc="Permite a los ciudadanos reportar problemas y hacer seguimiento, fomentando la colaboración y transparencia."
        />
        <InfoCard
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 40 40"
              fill="none"
              className="w-12 h-12 mx-auto"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="8" y="8" width="24" height="24" rx="5" fill="none" />
              <path d="M14 16h12" strokeLinecap="round" />
              <path d="M14 22h12" strokeLinecap="round" />
              <path d="M14 28h8" strokeLinecap="round" />
              <polyline points="11 16 12.5 18 15 14" strokeLinecap="round" />
              <polyline points="11 22 12.5 24 15 20" strokeLinecap="round" />
              <polyline points="11 28 12.5 30 15 26" strokeLinecap="round" />
            </svg>
          }
          title="Gestión de Tareas"
          desc="El municipio organiza, asigna y supervisa tareas para una respuesta eficiente y trazable."
        />
        <InfoCard
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 40 40"
              fill="none"
              className="w-12 h-12 mx-auto"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="10" y="24" width="4" height="8" rx="1" />
              <rect x="18" y="18" width="4" height="14" rx="1" />
              <rect x="26" y="12" width="4" height="20" rx="1" />
              <path d="M8 34h24" strokeLinecap="round" />
            </svg>
          }
          title="Estadísticas y Avances"
          desc="Visualiza el progreso de la ciudad con estadísticas claras y reportes de avance en tiempo real."
        />
      </div>

      {/* Botones de acción */}
      <div className="w-full max-w-2xl mx-auto bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-8 flex flex-col gap-8 border border-cyan-200 mt-8">
        <h2 className="text-2xl font-extrabold text-cyan-700 mb-6 text-center tracking-tight">
          ¿Querés hacer un reporte ?
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/register"
            className="px-6 py-2 rounded-xl bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition"
          >
            Registrarse
          </Link>
          <Link
            to="/login"
            className="px-6 py-2 rounded-xl bg-white border border-cyan-600 text-cyan-600 font-semibold hover:bg-cyan-50 transition"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
      {/* Bloque de contacto */}
      <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4 border border-cyan-200 mt-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-mail-icon lucide-mail"
            >
              <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
              <rect x="2" y="4" width="20" height="16" rx="2" />
            </svg>
          </span>
          <h3 className="text-xl font-bold text-cyan-700">
            ¿Necesitás contactarnos?
          </h3>
        </div>
        <p className="text-center text-cyan-900/80 mb-2">
          Si tenés dudas, sugerencias o consultas, podés escribirnos y te
          responderemos a la brevedad.
        </p>
        <a
          href="mailto:contacto@munifor.com"
          className="px-6 py-2 rounded-xl bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition shadow"
        >
          Enviar correo
        </a>
      </div>
    </section>
  );
};

export default Home;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * Home = inicio
 */
