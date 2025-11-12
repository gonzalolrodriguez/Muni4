//! ===============================================
//! REGISTRATION REQUESTS - Solicitudes de registro
//! ===============================================
//* Ruta: /admin/registration-requests
//* Layout: AdminLayout
//* Acceso: Solo rol "Administrador"

//* Propósito:
//? Página para administrar solicitudes de registro de nuevos usuarios
//? Endpoint GET: /user/pending (obtiene usuarios pendientes de aprobación)
//? Endpoint PUT: /user/available/:id (aprueba un usuario)
//? Endpoint PUT: /user/reject/:id (rechaza un usuario)
//? Permite aprobar o rechazar solicitudes de Operadores y Trabajadores

import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import ProfileDetails from "../../components/details/ProfileDetails";

/**
 * * Componente RegistrationRequests
 * ? Gestiona las solicitudes de registro pendientes de aprobación
 * @returns {JSX.Element} Vista de dos columnas: lista de solicitudes + detalles del seleccionado
 *
 * Características:
 * - Muestra lista de usuarios con estado "pending" (Operadores y Trabajadores)
 * - Permite ver detalles completos de cada solicitante
 * - Botones para aprobar o rechazar solicitudes
 * - Actualiza la lista automáticamente tras aprobar/rechazar
 */
const RegistrationRequests = () => {
  const { getFetchData, putFetch } = useFetch();

  //? Estados del componente
  const [pendingUsers, setPendingUsers] = useState([]); //* Lista de usuarios pendientes de aprobación
  const [selectedUser, setSelectedUser] = useState(null); //* Usuario actualmente seleccionado para ver detalles

  /**
   * * Función fetchPendingUsers
   * ? Obtiene la lista de usuarios pendientes de aprobación desde el backend
   * ! Endpoint: GET /user/pending
   * ! Estructura de respuesta: { users: [...] }
   *
   * //* Se ejecuta:
   * //? - Al montar el componente (useEffect)
   * //? - Después de aprobar un usuario
   * //? - Después de rechazar un usuario
   */
  const fetchPendingUsers = async () => {
    try {
      const data = await getFetchData("/user/pending");
      setPendingUsers(data.users || []); //* Actualiza la lista de usuarios pendientes
    } catch (error) {
      console.error(error);
      setPendingUsers([]); //? En caso de error, establece lista vacía
    }
  };

  /**
   * * useEffect - Cargar usuarios pendientes al montar
   * ? Se ejecuta una vez al montar el componente
   */
  useEffect(() => {
    fetchPendingUsers();
  }, []);

  /**
   * * Función handleAccept
   * ? Aprueba una solicitud de registro (cambia estado de "pending" a "available")
   * @param {string} userId - ID del usuario a aprobar
   * ! Endpoint: PUT /user/available/:id
   *
   * Flujo:
   * 1. Llama al endpoint PUT /user/available con el userId
   * 2. Actualiza la lista de pendientes (refrescar)
   * 3. Cierra el panel de detalles
   */
  const handleAccept = async (userId) => {
    try {
      await putFetch("/user/available", userId, {});
      fetchPendingUsers(); //* Refrescar la lista después de aceptar
      setSelectedUser(null); //? Cerrar detalles del usuario aceptado
    } catch (error) {
      console.error("Error al aceptar usuario:", error);
    }
  };

  /**
   * * Función handleReject
   * ? Rechaza una solicitud de registro (cambia estado a "rejected")
   * @param {string} userId - ID del usuario a rechazar
   * ! Endpoint: PUT /user/reject/:id
   *
   * Flujo:
   * 1. Llama al endpoint PUT /user/reject con el userId
   * 2. Actualiza la lista de pendientes (refrescar)
   * 3. Cierra el panel de detalles
   */
  const handleReject = async (userId) => {
    try {
      await putFetch("/user/reject", userId, {});
      fetchPendingUsers(); //* Refrescar la lista después de rechazar
      setSelectedUser(null); //? Cerrar detalles del usuario rechazado
    } catch (error) {
      console.error("Error al rechazar usuario:", error);
    }
  };

  //? ============================================
  //? RENDERIZADO JSX
  //? ============================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf4fe] to-[#d2e7fa] flex items-center justify-center py-12">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-cyan-300 p-10">
        {/* ====== COLUMNA IZQUIERDA: Lista de solicitudes pendientes ====== */}
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl font-extrabold text-cyan-700 mb-2 text-center tracking-tight drop-shadow">Solicitudes de registro</h2>
          {pendingUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <span className="text-cyan-500 text-lg">No hay solicitudes de registro pendientes</span>
            </div>
          ) : (
            <div className="space-y-4 max-h-[700px] overflow-y-auto">
              {pendingUsers.map((user) => (
                <div
                  key={user._id}
                  className={`bg-white/90 rounded-xl shadow-lg border border-cyan-200 w-full p-5 hover:cursor-pointer transition-all duration-200 ${selectedUser?._id === user._id ? "ring-2 ring-cyan-400" : "hover:ring-2 hover:ring-cyan-200"
                    }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <h3 className="text-lg font-bold text-cyan-700 mb-2">
                    {user.profile.first_name} {user.profile.last_name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === "Operador"
                          ? "bg-cyan-100 text-cyan-700"
                          : user.role === "Trabajador"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {user.role}
                    </span>
                    <span className="text-xs text-cyan-500">
                      {new Date(user.created_at).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* ====== COLUMNA DERECHA: Detalles del usuario seleccionado ====== */}
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl font-extrabold text-cyan-700 mb-2 text-center tracking-tight drop-shadow">Detalles del solicitante</h2>
          {!selectedUser ? (
            <div className="flex flex-col items-center justify-center py-12">
              <span className="text-cyan-500 text-lg">Selecciona una solicitud para ver detalles</span>
            </div>
          ) : (
            <ProfileDetails
              user={selectedUser}
              showActions={true}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationRequests;

//! ===============================================
//! TRADUCCIÓN DE CONSTANTES
//! ===============================================
/**
 * ESPAÑOL | INGLÉS
 * ----------------
 * pendingUsers = usuarios pendientes
 * selectedUser = usuario seleccionado
 * fetchPendingUsers = obtener usuarios pendientes
 * handleAccept = manejar aceptación
 * handleReject = manejar rechazo
 * role = rol
 * created_at = creado en (fecha de creación)
 * showActions = mostrar acciones
 * onAccept = al aceptar
 * onReject = al rechazar
 */
