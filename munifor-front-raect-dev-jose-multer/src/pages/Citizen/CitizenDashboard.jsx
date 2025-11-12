//* ========================================
//* PÁGINA: CitizenDashboard
//* ========================================
//* Propósito: Panel principal del ciudadano con estadísticas y accesos rápidos
//* Ruta: /citizen/dashboard
//* Layout: CitizenLayout
//* Características:
//*   - Tarjetas de acceso rápido (4): Hacer reporte, Mis reportes, Perfil, Contacto
//*   - Estadísticas de reportes por estado (6): Pendiente, Revisado, Completado, Aceptado, Rechazado, Total
//*   - Endpoint: /dashboard/citizens (trae counts de reportes del usuario)
//*   - Navegación con useNavigate al hacer click en tarjetas

import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const CitizenDashboard = () => {
  //* ========================================
  //* CONTEXTO Y ESTADO
  //* ========================================
  const { user } = useContext(UserContext);
  //? Estado de contadores por status de reporte
  const [counts, setCounts] = useState({
    pending: 0,
    reviewed: 0,
    completed: 0,
    accepted: 0,
    rejected: 0,
    total: 0,
  });

  //* Hooks personalizados
  const { getFetchData } = useFetch();
  const navigate = useNavigate();

  //* ========================================
  //* EFECTO: Cargar estadísticas del ciudadano
  //* ========================================
  useEffect(() => {
    let isMounted = true; // Prevenir actualizaciones si se desmonta

    const fetchCounts = async () => {
      try {
        //! Endpoint que trae los counts de reportes del usuario autenticado
        const data = await getFetchData("/dashboard/citizens");
        if (isMounted) {
          console.log(data);
          if (data.ok) setCounts(data.counts);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
        }
      }
    };

    fetchCounts();

    //! Cleanup: marcar componente como desmontado
    return () => {
      isMounted = false;
    };
  }, [user, getFetchData]);

  //* ========================================
  //* RENDER
  //* ========================================
  return (
    <div className="min-h-screen bg-[#eaf4fe] p-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-cyan-700 mb-2 drop-shadow">
          ¡Bienvenido, {user?.role}!
        </h1>
        <p className="text-cyan-600 text-lg">Panel de control del ciudadano</p>
      </div>
      {/* //? TARJETAS DE ESTADÍSTICAS POR STATUS (6) */}
      <div className="flex flex-col gap-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-yellow-100/70 backdrop-blur-md shadow-2xl rounded-2xl text-yellow-700 p-6 flex flex-col items-center justify-center border border-yellow-200">
            <span className="text-3xl font-bold">{counts.pending}</span>
            <span className="mt-2 font-semibold">Pendientes</span>
          </div>
          <div className="bg-cyan-100/70 backdrop-blur-md shadow-2xl rounded-2xl text-cyan-700 p-6 flex flex-col items-center justify-center border border-cyan-200">
            <span className="text-3xl font-bold">{counts.reviewed}</span>
            <span className="mt-2 font-semibold">Revisados</span>
          </div>
          <div className="bg-purple-100/70 backdrop-blur-md shadow-2xl rounded-2xl text-purple-700 p-6 flex flex-col items-center justify-center border border-purple-200">
            <span className="text-3xl font-bold">{counts.completed}</span>
            <span className="mt-2 font-semibold">Completados</span>
          </div>
          <div className="bg-green-100/70 backdrop-blur-md shadow-2xl rounded-2xl text-green-700 p-6 flex flex-col items-center justify-center border border-green-200">
            <span className="text-3xl font-bold">{counts.accepted}</span>
            <span className="mt-2 font-semibold">Aceptados</span>
          </div>
          <div className="bg-red-100/70 backdrop-blur-md shadow-2xl rounded-2xl text-red-700 p-6 flex flex-col items-center justify-center border border-red-200">
            <span className="text-3xl font-bold">{counts.rejected}</span>
            <span className="mt-2 font-semibold">Rechazados</span>
          </div>
          <div className="bg-blue-100/70 backdrop-blur-md shadow-2xl rounded-2xl text-blue-700 p-6 flex flex-col items-center justify-center border border-blue-300">
            <span className="text-3xl font-bold">{counts.total}</span>
            <span className="mt-2 font-semibold">Total</span>
          </div>
        </div>
      </div>
      {/* //? TARJETAS DE ACCESO RÁPIDO (4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* //? Tarjeta 1: Hacer reporte */}
        <div
          className="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-6 border border-cyan-200 hover:scale-[1.03] transition-transform cursor-pointer"
          onClick={() => navigate("/citizen/reports")}
        >
          <div className="text-4xl mb-4 text-cyan-600">➕</div>
          <h3 className="text-xl font-bold text-cyan-700 mb-2">Hacer Reporte</h3>
          <p className="text-cyan-600 text-sm">Crea un nuevo reporte</p>
        </div>
        {/* //? Tarjeta 2: Mis reportes */}
        <div
          className="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-6 border border-cyan-200 hover:scale-[1.03] transition-transform cursor-pointer"
          onClick={() => navigate("/citizen/reportstatus")}
        >
          <div className="text-4xl mb-4 text-cyan-600">📋</div>
          <h3 className="text-xl font-bold text-cyan-700 mb-2">Mis Reportes</h3>
          <p className="text-cyan-600 text-sm">Ver estado de reportes</p>
        </div>
        {/* //? Tarjeta 3: Mi perfil */}
        <div
          className="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-6 border border-cyan-200 hover:scale-[1.03] transition-transform cursor-pointer"
          onClick={() => navigate("/citizen/profile")}
        >
          <div className="text-4xl mb-4 text-cyan-600">👤</div>
          <h3 className="text-xl font-bold text-cyan-700 mb-2">Mi Perfil</h3>
          <p className="text-cyan-600 text-sm">Editar información personal</p>
        </div>
        {/* //? Tarjeta 4: Contacto */}
        <div
          className="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-6 border border-cyan-200 hover:scale-[1.03] transition-transform cursor-pointer"
          onClick={() => navigate("/citizen/contact")}
        >
          <div className="text-4xl mb-4 text-cyan-600">✉️</div>
          <h3 className="text-xl font-bold text-cyan-700 mb-2">Contactanos</h3>
          <p className="text-cyan-600 text-sm">Envianos tus consultas</p>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * CitizenDashboard = panel de ciudadano
 * user = usuario
 * UserContext = contexto de usuario
 * counts = contadores
 * setCounts = establecer contadores
 * pending = pendiente
 * reviewed = revisado
 * completed = completado
 * accepted = aceptado
 * rejected = rechazado
 * total = total
 * getFetchData = obtener datos del fetch
 * useFetch = usar fetch
 * navigate = navegar
 * useNavigate = usar navegar
 * isMounted = está montado
 * fetchCounts = obtener contadores
 * data = datos
 * err = error
 * role = rol
 */
