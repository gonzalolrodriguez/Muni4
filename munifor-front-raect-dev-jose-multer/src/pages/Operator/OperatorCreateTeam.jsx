//! ========================================
//! OPERATOR CREATE TEAMS - CREAR CUADRILLAS CON LÍDER Y MIEMBROS
//! ========================================
//* Propósito: Página para crear nuevas cuadrillas seleccionando un líder y miembros de trabajadores
//* Ruta: /operator/create-team
//* Layout: OperatorLayout (con OperatorNavBar)
//* Endpoint: GET /user/workers - Obtiene lista de trabajadores disponibles
//*           POST /crew - Crea nueva cuadrilla con nombre, líder y miembros
//* Características:
//*   - Dos columnas: Trabajadores disponibles (izquierda) y Formulario (derecha)
//*   - Selección única de líder (obligatorio)
//*   - Selección múltiple de miembros (opcional)
//*   - Búsqueda por username de trabajador
//*   - Validación: líder no puede ser miembro y viceversa

import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import useFilter from "../../hooks/useFilter";

//? ========================================
//? COMPONENTE PRINCIPAL - OPERATORCREATETEAMS
//? ========================================
//* Descripción: Permite crear cuadrillas asignando un líder y miembros desde lista de trabajadores
//* @returns {JSX.Element} - Vista con 2 columnas (trabajadores + formulario)
//* Uso: Operadores crean cuadrillas para asignarles tareas
const OperatorCreateTeams = () => {
  const { getFetchData, postFetchLocalStorage } = useFetch();

  //? Estados para datos desde el backend
  const [workers, setWorkers] = useState([]); //* Lista de todos los trabajadores disponibles

  //? Estados para búsqueda
  const [search, setSearch] = useState(""); //* Búsqueda por username
  const { filterBySearch } = useFilter();

  //? Estados para formulario de creación
  const [name, setName] = useState(""); //* Nombre de la cuadrilla
  const [leader, setLeader] = useState(null); //* ID del líder seleccionado (único, obligatorio)
  const [members, setMembers] = useState([]); //* Array de IDs de miembros seleccionados (opcional)

  //? Estados para controlar secciones de selección
  const [selectingLeader, setSelectingLeader] = useState(false); //* Muestra/oculta sección de selección de líder
  const [selectingMembers, setSelectingMembers] = useState(false); //* Muestra/oculta sección de selección de miembros

  const [error, setError] = useState(null); //* Estado para mensajes de error

  //? ========================================
  //? EFFECT: CARGAR LISTA DE TRABAJADORES
  //? ========================================
  //* Se ejecuta al montar el componente
  //* Obtiene todos los trabajadores disponibles para formar cuadrillas
  const fetchWorkers = async () => {
    try {
      //? Llama al endpoint para obtener trabajadores con role="Trabajador"
      const data = await getFetchData("/user/workers");
      console.log(data);
      //? Actualiza estado con lista de trabajadores
      setWorkers(data.workers);
    } catch (error) {
      console.error("Error al obtener los trabajadores:", error);
    }
  };
  useEffect(() => {
    fetchWorkers();
  }, []); //* Solo se ejecuta una vez al montar

  //? ========================================
  //? HANDLERS: SELECCIÓN DE LÍDER
  //? ========================================

  //* Selecciona un trabajador como líder de la cuadrilla
  //* @param {String} workerId - ID del trabajador a seleccionar como líder
  const handleLeaderSelect = (workerId) => {
    setLeader(workerId); //* Establece el líder
    setSelectingLeader(false); //* Cierra la sección de selección
    //? Si el trabajador estaba como miembro, lo quita de miembros (no puede ser ambos)
    setMembers((prev) => prev.filter((id) => id !== workerId));
  };

  //* Remueve el líder seleccionado
  const handleRemoveLeader = () => {
    setLeader(null);
  };

  //? ========================================
  //? HANDLERS: SELECCIÓN DE MIEMBROS
  //? ========================================

  //* Selecciona/deselecciona un trabajador como miembro
  //* @param {String} workerId - ID del trabajador a seleccionar/deseleccionar
  const handleMemberSelect = (workerId) => {
    //? Previene que el líder sea agregado como miembro
    if (workerId === leader) return;
    //? Toggle: si ya está, lo quita; si no, lo agrega
    setMembers(
      (prev) =>
        prev.includes(workerId)
          ? prev.filter((id) => id !== workerId) //* Quita del array
          : [...prev, workerId] //* Agrega al array
    );
  };

  //? ========================================
  //? HANDLER: ENVIAR FORMULARIO
  //? ========================================

  //* Envía la nueva cuadrilla al backend y resetea el formulario
  const handleSubmit = () => {
    // Validaciones
    if (!name) {
      setError("El nombre del equipo es obligatorio.");
      return;
    }
    if (!leader) {
      setError("Debe seleccionar un líder para el equipo.");
      return;
    }
    if (!members || members.length < 2) {
      setError("Debe seleccionar al menos 2 miembros para la cuadrilla.");
      return;
    }
    setError(null);
    //? Construye payload con datos de la cuadrilla
    const payload = {
      name, //* Nombre de la cuadrilla
      leader, //* ID del líder
      members, //* Array de IDs de miembros
    };
    console.log("Payload para crear equipo:", payload);
    //? Envía POST a /crew
    postFetchLocalStorage("/crew", payload);
    //? Resetea formulario después de crear
    // setMembers([]);
    // setLeader(null);
    // setName("");
    setWorkers([]);
    fetchWorkers();
  };

  //? ========================================
  //? FILTROS: BÚSQUEDA DE TRABAJADORES
  //? ========================================
  //* Filtra trabajadores por username usando el hook useFilter
  const filteredWorkers = filterBySearch(workers, search, "username");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-cyan-100">
      {/* ========================================
          SECCIÓN: HEADER
          ======================================== */}
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-cyan-700 mb-6 tracking-tight drop-shadow text-center">
          Equipos y Trabajadores
        </h2>
      </div>

      {/* ========================================
          SECCIÓN: DOS COLUMNAS (TRABAJADORES + FORMULARIO)
          ======================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
        {/* ========================================
            COLUMNA IZQUIERDA: TRABAJADORES DISPONIBLES
            ======================================== 
            * Lista de trabajadores filtrados por búsqueda
            * Al hacer clic, se agregan como miembros (columna izquierda)
            * Muestra username y rol
        */}
        <div>
          <h3 className="text-xl font-bold text-cyan-700 mb-4">
            Trabajadores disponibles
          </h3>
          {/* Input de búsqueda por username */}
          <input
            type="text"
            placeholder="Buscar trabajador..."
            className="border rounded-xl px-3 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-cyan-300 mb-4 bg-white/70 backdrop-blur-md shadow"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* Lista de trabajadores filtrados */}
          {filteredWorkers.length > 0 ? (
            filteredWorkers.map((worker) => (
              <div
                key={worker._id}
                className={`bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-3 flex flex-col border border-cyan-200 w-full mb-3 min-h-14 hover:scale-[1.02] hover:shadow-2xl transition-all hover:cursor-pointer ${
                  members.includes(worker._id)
                    ? "border-blue-500 ring-2 ring-blue-300" //* Estilo cuando está seleccionado como miembro
                    : "border-gray-200" //* Estilo por defecto
                }`}
                onClick={() => {
                  handleMemberSelect(worker._id); //* Agregar/quitar como miembro
                }}
              >
                <span className="block text-base font-semibold text-cyan-900">
                  {worker.username}
                </span>
                <span className="text-sm text-cyan-600">
                  {worker.role || "Sin rol"}
                </span>
              </div>
            ))
          ) : (
            <div className="py-2 text-cyan-600">
              No hay trabajadores disponibles
            </div>
          )}
        </div>

        {/* ========================================
            COLUMNA DERECHA: FORMULARIO CREAR CUADRILLA
            ======================================== */}
        <div>
          <h3 className="text-xl font-bold text-cyan-700 mb-4">
            Crear nuevo equipo
          </h3>

          {/* ========================================
              CAMPO: NOMBRE DEL EQUIPO
              ======================================== */}
          <div className="mb-6">
            <label className="block font-semibold text-cyan-800 mb-2">
              Nombre del equipo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-xl px-3 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-white/70 backdrop-blur-md shadow"
              placeholder="Ingrese el nombre del equipo"
              required
            />
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          </div>

          {/* ========================================
              CAMPO: SELECCIÓN DE LÍDER (ÚNICO)
              ======================================== 
              * Botón "Seleccionar" abre grid de trabajadores
              * Solo uno puede ser líder
              * Muestra nombre del líder seleccionado
              * Botón "Eliminar" para quitar líder
          */}
          <div className="mb-6">
            <label className="block font-semibold text-cyan-800 mb-2">
              Seleccione líder
            </label>
            <div className="flex items-center gap-2 mb-2">
              {/* Botón para seleccionar o eliminar líder */}
              <button
                type="button"
                className={`px-4 py-2 rounded-xl font-semibold transition-colors duration-150 ${
                  leader ? "bg-red-600 text-white" : "bg-blue-600 text-white"
                }`}
                onClick={() =>
                  leader ? handleRemoveLeader() : setSelectingLeader(true)
                }
              >
                {leader ? "Eliminar" : "Seleccionar"}
              </button>
              {/* Muestra nombre del líder si está seleccionado */}
              {leader && (
                <span className="ml-2 font-semibold text-cyan-700">
                  {workers.find((w) => w._id === leader)?.username}
                </span>
              )}
            </div>
            {/* Grid de trabajadores para seleccionar líder */}
            {selectingLeader && (
              <div className="flex flex-wrap gap-2 mt-2">
                {workers.length > 0 ? (
                  workers
                    .filter((w) => !members.includes(w._id)) //* Excluye a los que ya son miembros
                    .map((worker) => (
                      <div
                        key={worker._id}
                        className={`bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-3 flex flex-col border border-cyan-200 hover:scale-[1.02] hover:shadow-2xl transition-all hover:cursor-pointer min-w-[140px] min-h-14 text-center
                        ${
                          leader === worker._id
                            ? "border-red-600 ring-2 ring-red-400" //* Estilo cuando es el líder
                            : "border-gray-200" //* Estilo por defecto
                        }
                      `}
                        onClick={() => handleLeaderSelect(worker._id)}
                      >
                        <span className="block text-base font-semibold text-cyan-900">
                          {worker.username}
                        </span>
                        <span className="text-sm text-cyan-600">
                          {worker.role || "Sin rol"}
                        </span>
                      </div>
                    ))
                ) : (
                  <span>No hay trabajadores disponibles</span>
                )}
              </div>
            )}
          </div>

          {/* ========================================
              CAMPO: SELECCIÓN DE MIEMBROS (MÚLTIPLES)
              ======================================== 
              * Botón "Seleccionar" abre grid de trabajadores
              * Permite seleccionar varios miembros
              * No puede incluir al líder
              * Muestra badges con nombres de miembros seleccionados
          */}
          <div className="mb-6">
            <label className="block font-semibold text-cyan-800 mb-2">
              Seleccione miembros
            </label>
            <div className="flex items-center gap-2 mb-2">
              {/* Botón para toggle sección de selección */}
              <button
                type="button"
                className="px-4 py-2 rounded-xl font-semibold transition-colors duration-150 bg-cyan-600 text-white"
                onClick={() => setSelectingMembers(!selectingMembers)}
              >
                Seleccionar
              </button>
              {/* Badges con nombres de miembros seleccionados */}
              {members.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {members.map((id) => (
                    <span
                      key={id}
                      className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded text-sm font-medium"
                    >
                      {workers.find((w) => w._id === id)?.username}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {/* Grid de trabajadores para seleccionar miembros */}
            {selectingMembers && (
              <div className="flex flex-wrap gap-2 mt-2">
                {workers.length > 0 ? (
                  workers
                    .filter((w) => w._id !== leader) //* Excluye al líder (no puede ser miembro)
                    .map((worker) => (
                      <div
                        key={worker._id}
                        className={`bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-3 flex flex-col border border-cyan-200 hover:scale-[1.02] hover:shadow-2xl transition-all hover:cursor-pointer min-w-[140px] min-h-14 text-center
                        ${
                          members.includes(worker._id)
                            ? "border-blue-500 ring-2 ring-blue-300" //* Estilo cuando está seleccionado
                            : "border-gray-200" //* Estilo por defecto
                        }
                      `}
                        onClick={() => handleMemberSelect(worker._id)}
                      >
                        <span className="block text-base font-semibold text-cyan-900">
                          {worker.username}
                        </span>
                        <span className="text-sm text-cyan-600">
                          {worker.role || "Sin rol"}
                        </span>
                      </div>
                    ))
                ) : (
                  <span>No hay trabajadores disponibles</span>
                )}
              </div>
            )}
          </div>

          {/* ========================================
              BOTÓN: CREAR EQUIPO
              ======================================== */}
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 rounded-xl font-semibold transition-colors duration-150 bg-cyan-600 text-white"
              onClick={handleSubmit}
            >
              Crear equipo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorCreateTeams;

//! ========================================
//! TRADUCCIÓN DE CONSTANTES
//! ========================================
//* workers - trabajadores
//* search - búsqueda
//* name - nombre
//* leader - líder
//* members - miembros
//* selectingLeader - seleccionando líder
//* selectingMembers - seleccionando miembros
//* handleLeaderSelect - manejar selección de líder
//* handleRemoveLeader - manejar eliminación de líder
//* handleMemberSelect - manejar selección de miembro
//* handleSubmit - manejar envío
//* filteredWorkers - trabajadores filtrados
