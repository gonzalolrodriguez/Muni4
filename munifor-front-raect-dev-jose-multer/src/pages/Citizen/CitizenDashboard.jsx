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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">¡Bienvenido, {user?.role}!</h1>
        <p className="text-gray-600 text-lg">Panel de control del ciudadano</p>
      </div>
      {/* //? TARJETAS DE ACCESO RÁPIDO (4) */}
      {/* //? ======================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* //? Tarjeta 1: Hacer reporte */}
        <div
          className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:cursor-pointer"
          onClick={() => navigate("/citizen/reports")}
        >
          <div className="text-4xl mb-4">➕</div>
          <h3 className="text-xl font-semibold mb-2">Hacer Reporte</h3>
          <p className="text-gray-600 text-sm">Crea un nuevo reporte</p>
        </div>

        {/* //? Tarjeta 2: Mis reportes */}
        <div
          className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:cursor-pointer"
          onClick={() => navigate("/citizen/reportstatus")}
        >
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2">Mis Reportes</h3>
          <p className="text-gray-600 text-sm">Ver estado de reportes</p>
        </div>

        {/* //? Tarjeta 3: Mi perfil */}
        <div
          className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:cursor-pointer"
          onClick={() => navigate("/citizen/profile")}
        >
          <div className="text-4xl mb-4">👤</div>
          <h3 className="text-xl font-semibold mb-2">Mi Perfil</h3>
          <p className="text-gray-600 text-sm">Editar información personal</p>
        </div>

        {/* //? Tarjeta 4: Contacto */}
        <div
          className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:cursor-pointer"
          onClick={() => navigate("/citizen/contact")}
        >
          <div className="text-4xl mb-4">✉️</div>
          <h3 className="text-xl font-semibold mb-2">Contactanos</h3>
          <p className="text-gray-600 text-sm">Envianos tus consultas</p>
        </div>
      </div>

      {/* //? ======================================== */}
      {/* //? TARJETAS DE ESTADÍSTICAS POR STATUS (6) */}
      {/* //? ======================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {/* //? Estadística 1: Pendientes */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-yellow-600 mb-2">
            Pendientes
          </h3>
          <p className="text-4xl font-bold mb-2">{counts.pending}</p>
          <p className="text-gray-600 text-sm">Reportes sin revisar</p>
        </div>

        {/* //? Estadística 2: Revisados */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-blue-600 mb-2">
            Revisados
          </h3>
          <p className="text-4xl font-bold mb-2">{counts.reviewed}</p>
          <p className="text-gray-600 text-sm">En seguimiento</p>
        </div>

        {/* //? Estadística 3: Completados */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-green-600 mb-2">
            Completados
          </h3>
          <p className="text-4xl font-bold mb-2">{counts.completed}</p>
          <p className="text-gray-600 text-sm">Resueltos exitosamente</p>
        </div>

        {/* //? Estadística 4: Aceptados */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-cyan-600 mb-2">
            Aceptados
          </h3>
          <p className="text-4xl font-bold mb-2">{counts.accepted}</p>
          <p className="text-gray-600 text-sm">Convertidos en tarea</p>
        </div>

        {/* //? Estadística 5: Rechazados */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Rechazados
          </h3>
          <p className="text-4xl font-bold mb-2">{counts.rejected}</p>
          <p className="text-gray-600 text-sm">No aprobados por el operador</p>
        </div>

        {/* //? Estadística 6: Total */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-purple-600 mb-2">Total</h3>
          <p className="text-4xl font-bold mb-2">{counts.total}</p>
          <p className="text-gray-600 text-sm">Todos tus reportes</p>
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
