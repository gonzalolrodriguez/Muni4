//! ========================================
//! ADMIN PROFILE SEARCH - DIRECTORIO DE USUARIOS
//! ========================================
//* Propósito: Página para buscar y visualizar todos los usuarios del sistema
//* Ruta: /admin/profile-search
//* Layout: AdminLayout (con AdminNavBar)
//* Endpoint: GET /user/all - Obtiene todos los usuarios
//* Características:
//*   - Lista completa de usuarios (ciudadanos, operadores, trabajadores, administradores)
//*   - Búsqueda por nombre, email o DNI
//*   - Muestra información básica (nombre, rol, DNI, email)

import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";

//? ========================================
//? COMPONENTE PRINCIPAL - ADMINPROFILESEARCH
//? ========================================
//* Descripción: Directorio de todos los usuarios con búsqueda
//* @returns {JSX.Element} - Lista de usuarios con campo de búsqueda
//* Uso: Administradores pueden buscar y visualizar información de cualquier usuario
const AdminProfileSearch = () => {
  const { getFetchData } = useFetch();

  //? Estados para datos y búsqueda
  const [users, setUsers] = useState([]); //* Lista completa de usuarios
  const [search, setSearch] = useState(""); //* Texto de búsqueda

  //? ========================================
  //? EFFECT: CARGAR TODOS LOS USUARIOS
  //? ========================================
  //* Se ejecuta al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        //? Obtiene todos los usuarios del sistema
        const data = await getFetchData("/user/all");
        //? Valida que sea un array antes de actualizar estado
        setUsers(Array.isArray(data?.users) ? data.users : []);
      } catch (error) {
        setUsers([]); //* Si hay error, muestra lista vacía
      }
    };
    fetchUsers();
  }, []); //* Solo al montar

  //? ========================================
  //? FILTROS: BÚSQUEDA POR NOMBRE, EMAIL O DNI
  //? ========================================
  //* Filtra usuarios por coincidencia en nombre, email o DNI
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) || //* Busca en nombre
      u.email.toLowerCase().includes(search.toLowerCase()) || //* Busca en email
      (u.dni && u.dni.toString().includes(search)) //* Busca en DNI
  );

  return (
    <div className="min-h-screen bg-gray-50 max-w-4xl mx-auto w-full py-8">
      {/* ========================================
          SECCIÓN: HEADER
          ======================================== */}
      <h1 className="text-2xl font-bold text-gray-700 mb-8">User Directory</h1>

      {/* ========================================
          SECCIÓN: BÚSQUEDA
          ======================================== */}
      <input
        type="text"
        placeholder="Search by name, email or DNI..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 px-4 py-2 border border-gray-300 rounded w-full"
      />

      {/* ========================================
          SECCIÓN: LISTA DE USUARIOS
          ======================================== */}
      {filteredUsers.length === 0 ? (
        //* Mensaje cuando no hay usuarios
        <div className="flex flex-col items-center justify-center py-8">
          <span className="text-gray-500">No users found</span>
        </div>
      ) : (
        //* Lista de usuarios filtrados
        <div className="flex flex-col gap-4">
          {filteredUsers.map((user, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow p-4 flex justify-between items-center border border-gray-200 w-full"
            >
              <div>
                <span className="block text-base font-semibold text-gray-800">
                  {user.name} ({user.role})
                </span>
                <span className="block text-sm text-gray-500">
                  DNI: {user.dni}
                </span>
                <span className="block text-sm text-gray-500">
                  Email: {user.email}
                </span>
              </div>
              {/* TODO: Agregar acciones rápidas (editar, eliminar, etc.) */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProfileSearch;

//! ========================================
//! TRADUCCIÓN DE CONSTANTES
//! ========================================
//* users - usuarios
//* search - búsqueda
//* filteredUsers - usuarios filtrados
//* User Directory - Directorio de Usuarios
//* No users found - No se encontraron usuarios
//* Search by name, email or DNI - Buscar por nombre, email o DNI
