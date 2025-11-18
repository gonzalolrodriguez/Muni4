//! ========================================
//! OPERATOR TEAMS - VISUALIZACIÓN DE CUADRILLAS
//! ========================================
//* Propósito: Página para visualizar todas las cuadrillas con sus detalles
//* Ruta: /operator/teams
//* Layout: OperatorLayout (con OperatorNavBar)
//* Endpoint: GET /crews - Obtiene todas las cuadrillas
//* Características:
//*   - Lista de cuadrillas con nombre y cantidad de miembros
//*   - Búsqueda por nombre de cuadrilla
//*   - Modal de detalles con información completa (líder, miembros, tareas)

import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import useFilter from "../../hooks/useFilter";
import CrewDetails from "../../components/details/CrewDetails";
import Pagination from "../../components/Pagination";

//? ========================================
//? COMPONENTE PRINCIPAL - OPERATORTEAMS
//? ========================================
//* Descripción: Muestra lista de cuadrillas con búsqueda y detalles
//* @returns {JSX.Element} - Lista de cuadrillas con modal de detalles
//* Uso: Operadores visualizan cuadrillas creadas y sus miembros
const OperatorTeams = () => {
  const { getFetchData } = useFetch();

  //? Estados para datos y selección
  const [crews, setCrews] = useState([]); //* Lista completa de cuadrillas
  const [selectedCrew, setSelectedCrew] = useState(null); //* Cuadrilla seleccionada para mostrar en modal

  //? Estados para búsqueda
  const [search, setSearch] = useState(""); //* Búsqueda por nombre de cuadrilla
  const [currentPage, setCurrentPage] = useState(1); //* Página actual

  const { filterBySearch, limitData } = useFilter();

  //? ========================================
  //? EFFECT: CARGAR CUADRILLAS
  //? ========================================
  //* Se ejecuta al montar y cuando se cierra el modal (para refrescar)
  useEffect(() => {
    const fetchCrews = async () => {
      try {
        //? Obtiene todas las cuadrillas desde el endpoint
        const data = await getFetchData("/crews");
        setCrews(data.crews);
        console.log(data);
      } catch (error) {
        console.error("Error al obtener las cuadrillas:", error);
      }
    };
    fetchCrews();
  }, [selectedCrew]); //* Se re-ejecuta cuando se cierra el modal

  //? ========================================
  //? EFFECT: RESETEAR PÁGINA AL CAMBIAR BÚSQUEDA
  //? ========================================
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  //? ========================================
  //? FILTROS: BÚSQUEDA POR NOMBRE
  //? ========================================
  //* Filtra cuadrillas por nombre usando el hook useFilter
  const filteredCrews = filterBySearch(crews, search, "name");

  //* Aplicar paginación (10 cuadrillas por página)
  const { data: paginatedCrews, totalPages } = limitData(
    filteredCrews,
    20,
    currentPage
  );

  //? ========================================
  //? HANDLERS: ACCIONES DE CUADRILLAS
  //? ========================================

  //* Abre el modal con los detalles de la cuadrilla seleccionada
  //* @param {Object} crew - Cuadrilla a visualizar
  const handleSelectCrew = (crew) => {
    setSelectedCrew(crew);
  };

  //* Cierra el modal de detalles
  const closePanel = () => setSelectedCrew(null);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#eaf4fe] to-[#d2e7fa]">
      {/* ========================================
          SECCIÓN: HEADER CON BÚSQUEDA
          ======================================== */}
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-2">
        <h2 className="text-3xl font-extrabold text-cyan-700 mb-2 drop-shadow">
          Cuadrillas
        </h2>
        {/* Input de búsqueda por nombre */}
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-2 border-cyan-300 rounded-lg px-4 py-3 w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white shadow-sm placeholder-cyan-600/60 text-cyan-700"
        />
      </div>
      {/* ========================================
          SECCIÓN: PAGINACIÓN SUPERIOR
          ======================================== */}
      <div className="max-w-5xl mx-auto px-4 pb-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ========================================
          SECCIÓN: LISTA DE CUADRILLAS
          ======================================== */}
      <div className="space-y-4">
        {filteredCrews.length === 0 ? (
          //* Mensaje cuando no hay cuadrillas
          <div className="flex flex-col items-center justify-center py-16">
            <h3 className="text-lg text-cyan-700 font-semibold">
              No hay cuadrillas registradas
            </h3>
          </div>
        ) : (
          //* Lista de cuadrillas paginadas
          paginatedCrews.map((crew, idx) => (
            <div
              key={crew._id || idx}
              className="bg-white rounded-xl shadow-lg p-5 flex justify-between items-center border-2 border-cyan-300/20 w-full max-w-3xl mx-auto min-h-16 hover:cursor-pointer hover:shadow-xl transition-all duration-150"
              onClick={() => handleSelectCrew(crew)}
            >
              <div>
                <span className="block text-2xl font-bold text-cyan-700 mb-1">
                  {crew.name}
                </span>
                <span className="block text-sm text-cyan-600/70">
                  Miembros:{" "}
                  <span className="font-semibold text-cyan-700">
                    {crew.members ? crew.members.length : 0}
                  </span>
                </span>
              </div>
              {/* Badge de acción */}
              <span className="px-6 py-2 rounded-full text-base font-semibold shadow-sm border-2 bg-cyan-100 text-cyan-700 border-cyan-300">
                Ver
              </span>
            </div>
          ))
        )}

        {/* ========================================
            SECCIÓN: PAGINACIÓN INFERIOR
            ======================================== */}
        <div className="max-w-5xl mx-auto px-4 pt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            scrollToTop={true}
          />
        </div>

        {/* ========================================
            MODAL: DETALLES DE LA CUADRILLA
            ======================================== 
            * Muestra líder, miembros, tareas asignadas
        */}
        {selectedCrew && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CrewDetails crew={selectedCrew} onClose={closePanel} />
              {/* Botón cerrar */}
              <button
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 w-full"
                onClick={closePanel}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperatorTeams;

//! ========================================
//! TRADUCCIÓN DE CONSTANTES
//! ========================================
//* crews - cuadrillas
//* selectedCrew - cuadrilla seleccionada
//* search - búsqueda
//* filteredCrews - cuadrillas filtradas
//* handleSelectCrew - manejar selección de cuadrilla
//* closePanel - cerrar panel
