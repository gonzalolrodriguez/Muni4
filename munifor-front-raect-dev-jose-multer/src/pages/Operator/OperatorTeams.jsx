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

  const { filterBySearch } = useFilter();

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
  //? FILTROS: BÚSQUEDA POR NOMBRE
  //? ========================================
  //* Filtra cuadrillas por nombre usando el hook useFilter
  const filteredCrews = filterBySearch(crews, search, "name");

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ========================================
          SECCIÓN: HEADER CON BÚSQUEDA
          ======================================== */}
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-2">
        <h2 className="text-xl font-bold text-gray-700">Cuadrillas</h2>
        {/* Input de búsqueda por nombre */}
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* ========================================
          SECCIÓN: LISTA DE CUADRILLAS
          ======================================== */}
      <div className="space-y-4">
        {filteredCrews.length === 0 ? (
          //* Mensaje cuando no hay cuadrillas
          <div className="flex flex-col items-center justify-center py-16">
            <h3>No hay cuadrillas registradas</h3>
          </div>
        ) : (
          //* Lista de cuadrillas filtradas
          filteredCrews.map((crew, idx) => (
            <div
              key={crew._id || idx}
              className="bg-white rounded-lg shadow p-3 flex justify-between items-center border border-gray-200 w-full max-w-2xl mx-auto min-h-14 hover:cursor-pointer"
              onClick={() => handleSelectCrew(crew)}
            >
              <div>
                <span className="block text-xl font-semibold text-gray-800">
                  {crew.name}
                </span>
                <span className="block text-sm text-gray-500">
                  Miembros: {crew.members ? crew.members.length : 0}
                </span>
              </div>
              {/* Badge de acción */}
              <span className="px-4 py-2 rounded-full text-base font-medium bg-blue-100 text-blue-700">
                Ver
              </span>
            </div>
          ))
        )}

        {/* ========================================
            MODAL: DETALLES DE LA CUADRILLA
            ======================================== 
            * Muestra líder, miembros, tareas asignadas
        */}
        {selectedCrew && (
          <CrewDetails crew={selectedCrew} onClose={closePanel} />
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
