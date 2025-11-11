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
    <div className="min-h-screen bg-gray-50 max-w-5xl mx-auto w-full py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* ====== COLUMNA IZQUIERDA: Lista de solicitudes pendientes ====== */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Solicitudes de registro
        </h2>

        {/* Mensaje si no hay solicitudes pendientes */}
        {pendingUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <span className="text-gray-500">
              No hay solicitudes de registro pendientes
            </span>
          </div>
        ) : (
          /* Lista de usuarios pendientes */
          <div className="space-y-3 max-h-[700px] overflow-y-auto">
            {pendingUsers.map((user) => (
              <div
                key={user._id}
                className={`bg-white rounded-lg shadow p-4 border border-gray-200 w-full hover:cursor-pointer transition ${
                  selectedUser?._id === user._id ? "ring-2 ring-indigo-400" : "" //? Resalta usuario seleccionado
                }`}
                onClick={() => setSelectedUser(user)} //? Al hacer click, selecciona este usuario
              >
                {/* Nombre del usuario */}
                <h3 className="text-base font-semibold text-gray-800 mb-2">
                  {user.profile.first_name} {user.profile.last_name}
                </h3>

                <div className="flex items-center justify-between">
                  {/* Badge del rol solicitado */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === "Operador"
                        ? "bg-blue-100 text-blue-700" //? Azul para Operador
                        : user.role === "Trabajador"
                        ? "bg-green-100 text-green-700" //? Verde para Trabajador
                        : "bg-gray-100 text-gray-700" //? Gris para otros
                    }`}
                  >
                    {user.role}
                  </span>

                  {/* Fecha de solicitud */}
                  <span className="text-xs text-gray-500">
                    {new Date(user.created_at).toLocaleDateString("es-ES")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ====== COLUMNA DERECHA: Detalles del usuario seleccionado ====== */}
      <div>
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          Detalles del solicitante
        </h2>

        {/* Mensaje si no hay usuario seleccionado */}
        {!selectedUser ? (
          <div className="flex flex-col items-center justify-center py-8">
            <span className="text-gray-500">
              Selecciona una solicitud para ver detalles
            </span>
          </div>
        ) : (
          /* Componente ProfileDetails con botones de aceptar/rechazar */
          /*//* ProfileDetails recibe las funciones handleAccept y handleReject como props */
          <ProfileDetails
            user={selectedUser}
            showActions={true} //? Muestra los botones de aceptar/rechazar
            onAccept={handleAccept} //* Función para aprobar el usuario
            onReject={handleReject} //* Función para rechazar el usuario
          />
        )}
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
