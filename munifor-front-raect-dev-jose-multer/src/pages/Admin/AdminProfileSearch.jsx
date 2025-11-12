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
    <div className="min-h-screen bg-gradient-to-br from-[#eaf4fe] to-[#d2e7fa] flex items-center justify-center py-12">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-cyan-300 p-10">
        <h1 className="text-3xl font-extrabold text-cyan-700 mb-8 text-center tracking-tight drop-shadow">Directorio de Usuarios</h1>
        <input
          type="text"
          placeholder="Buscar por nombre, email o DNI..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-8 px-4 py-3 border border-cyan-300 rounded-xl w-full shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-700 bg-white/90"
        />
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="text-cyan-500 text-lg">No se encontraron usuarios</span>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredUsers.map((user, idx) => (
              <div
                key={idx}
                className="bg-white/90 rounded-xl shadow-lg border border-cyan-200 w-full p-6 flex justify-between items-center transition-all duration-200 hover:ring-2 hover:ring-cyan-300"
              >
                <div>
                  <span className="block text-lg font-bold text-cyan-700 mb-1">
                    {user.name} <span className="font-normal text-cyan-500">({user.role})</span>
                  </span>
                  <span className="block text-sm text-cyan-600">
                    DNI: {user.dni}
                  </span>
                  <span className="block text-sm text-cyan-600">
                    Email: {user.email}
                  </span>
                </div>
                {/* Acciones rápidas futuras */}
              </div>
            ))}
          </div>
        )}
      </div>
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
