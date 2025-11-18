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
import Pagination from "../../components/Pagination";

//? ========================================
//? COMPONENTE PRINCIPAL - ADMINPROFILESEARCH
//? ========================================
//* Descripción: Directorio de todos los usuarios con búsqueda
//* @returns {JSX.Element} - Lista de usuarios con campo de búsqueda
//* Uso: Administradores pueden buscar y visualizar información de cualquier usuario
const AdminProfileSearch = () => {
  const { getFetchData } = useFetch();

  //? Estados para datos y búsqueda
  const [users, setUsers] = useState([]); //* Lista completa de usuarios activos
  const [deletedUsers, setDeletedUsers] = useState([]); //* Lista de usuarios eliminados
  const [search, setSearch] = useState(""); //* Texto de búsqueda
  const [searchBy, setSearchBy] = useState("username"); //* Campo por el cual buscar (username, email, dni)
  const [showDeleted, setShowDeleted] = useState(false); //* Mostrar usuarios eliminados o activos

  //? Estados para paginación
  const [currentPage, setCurrentPage] = useState(1); //* Página actual
  const itemsPerPage = 20; //* Usuarios por página

  //? ========================================
  //? EFFECT: CARGAR TODOS LOS USUARIOS
  //? ========================================
  //* Se ejecuta al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        //? Obtiene todos los usuarios del sistema
        const data = await getFetchData("/user/all");
        //? Separa usuarios activos y eliminados
        setUsers(data.users || []);
        setDeletedUsers(data.userDeleted || []);
        console.log(data);
      } catch (error) {
        setUsers([]); //* Si hay error, muestra lista vacía
        setDeletedUsers([]);
      }
    };
    fetchUsers();
  }, []); //* Solo al montar

  //? ========================================
  //? FILTROS: BÚSQUEDA SEGÚN CRITERIO SELECCIONADO
  //? ========================================
  //* Selecciona el array correcto según showDeleted
  const currentUsers = showDeleted ? deletedUsers : users;

  //* Filtra usuarios por el campo seleccionado
  const filteredUsers = currentUsers.filter((u) => {
    // Si no hay búsqueda, mostrar todos los usuarios
    if (!search.trim()) return true;

    const searchLower = search.toLowerCase();

    if (searchBy === "username") {
      return u.name?.toLowerCase().includes(searchLower);
    } else if (searchBy === "email") {
      return u.email?.toLowerCase().includes(searchLower);
    } else if (searchBy === "dni") {
      return u.profile.dni?.toString().includes(search);
    }
    return false;
  });

  //? ========================================
  //? PAGINACIÓN: CALCULAR USUARIOS DE LA PÁGINA ACTUAL
  //? ========================================
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers_paginated = filteredUsers.slice(startIndex, endIndex);

  //? Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, showDeleted]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf4fe] to-[#d2e7fa] flex items-center justify-center py-12">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-cyan-300 p-10">
        <h1 className="text-3xl font-extrabold text-cyan-700 mb-8 text-center tracking-tight drop-shadow">
          Directorio de Usuarios
        </h1>

        {/* Controles de búsqueda */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Select: Buscar por */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-cyan-700 mb-2">
              Buscar por:
            </label>
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="w-full px-4 py-3 border border-cyan-300 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-700 bg-white"
            >
              <option value="username">Username</option>
              <option value="email">Email</option>
              <option value="dni">DNI</option>
            </select>
          </div>

          {/* Toggle: Usuarios activos/eliminados */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-cyan-700 mb-2">
              Mostrar:
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleted(false)}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition ${
                  !showDeleted
                    ? "bg-cyan-600 text-white shadow-lg"
                    : "bg-white text-cyan-600 border border-cyan-300"
                }`}
              >
                Activos ({users.length})
              </button>
              <button
                onClick={() => setShowDeleted(true)}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition ${
                  showDeleted
                    ? "bg-red-600 text-white shadow-lg"
                    : "bg-white text-red-600 border border-red-300"
                }`}
              >
                Eliminados ({deletedUsers.length})
              </button>
            </div>
          </div>
        </div>

        {/* Campo de búsqueda */}
        <input
          type="text"
          placeholder={`Buscar por ${
            searchBy === "username"
              ? "Username"
              : searchBy === "email"
              ? "Email"
              : "DNI"
          }...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-8 px-4 py-3 border border-cyan-300 rounded-xl w-full shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-700 bg-white/90"
        />
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="text-cyan-500 text-lg">
              No se encontraron usuarios
            </span>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-6">
              {currentUsers_paginated.map((user, idx) => (
                <div
                  key={idx}
                  className="bg-white/90 rounded-xl shadow-lg border border-cyan-200 w-full p-6 flex justify-between items-center transition-all duration-200 hover:ring-2 hover:ring-cyan-300"
                >
                  <div>
                    <span className="block text-lg font-bold text-cyan-700 mb-1">
                      {user.username}{" "}
                      <span className="font-normal text-cyan-500">
                        ({user.role})
                      </span>
                    </span>
                    <span className="block text-sm text-cyan-600">
                      DNI: {user.profile.dni}
                    </span>
                    <span className="block text-sm text-cyan-600">
                      Email: {user.email}
                    </span>
                  </div>
                  {/* Acciones rápidas futuras */}
                </div>
              ))}
            </div>

            {/* Componente de paginación */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
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
