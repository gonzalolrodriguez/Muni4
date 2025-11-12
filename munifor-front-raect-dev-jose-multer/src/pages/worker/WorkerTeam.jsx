//* ========================================
//* PÁGINA: WorkerTeam
//* ========================================
//* Propósito: Muestra el equipo actual y equipos anteriores del trabajador
//* Ruta: /worker/team
//* Layout: WorkerLayout
//* Características:
//*   - Columna izquierda: Equipo actual + Equipos anteriores
//*   - Columna derecha: Detalles del equipo seleccionado (líder, miembros, estado)
//*   - Endpoint: /crew/worker (equipo actual y equipos pasados del trabajador)
//*   - Badge "Líder" si el usuario es el líder del equipo
//*   - Muestra fecha de finalización si el equipo está inactivo

import { useEffect, useState, useContext } from "react";
import useFetch from "../../hooks/useFetch";
import { UserContext } from "../../context/UserContext";

const WorkerTeam = () => {
  //* ========================================
  //* CONTEXTO Y ESTADO
  //* ========================================
  const { getFetchData } = useFetch();
  const [currentCrew, setCurrentCrew] = useState(null);
  const [pastCrews, setPastCrews] = useState([]);
  const [selectedCrew, setSelectedCrew] = useState(null);
  const { user } = useContext(UserContext);

  //* ========================================
  //* EFECTO: Cargar equipos al montar
  //* ========================================
  useEffect(() => {
    const fetchCrews = async () => {
      try {
        //! Endpoint que trae el equipo actual y equipos pasados del trabajador
        const data = await getFetchData("/crew/worker");
        console.log(data);
        setCurrentCrew(data.crew);
        setPastCrews(data.pastCrews ? [data.pastCrews] : []);
      } catch (error) {
        console.error(error);
        setCurrentCrew(null);
        setPastCrews([]);
      }
    };
    fetchCrews();
  }, [getFetchData]);

  //* ========================================
  //* RENDER
  //* ========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 max-w-5xl mx-auto w-full py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* //? ======================================== */}
      {/* //? COLUMNA IZQUIERDA: LISTA DE EQUIPOS */}
      {/* //? ======================================== */}
      <div className="flex flex-col gap-6">
        {/* //? Sección 1: Equipo actual */}
        <h2 className="text-2xl font-bold text-cyan-700 mb-4 tracking-tight drop-shadow">Equipo actual</h2>
        {!currentCrew ? (
          <div className="flex flex-col items-center justify-center py-8">
            <span className="text-gray-400">No estás asignado a ningún equipo actualmente</span>
          </div>
        ) : (
          <div
            className={`bg-white rounded-xl shadow-md p-6 border w-full hover:cursor-pointer transition-all duration-200
              ${selectedCrew?._id === currentCrew._id
                ? "border-cyan-400 ring-2 ring-cyan-300"
                : "border-gray-200 hover:border-cyan-300 hover:shadow-lg"}
            `}
            onClick={() => setSelectedCrew(currentCrew)}
          >
            <h3 className="text-lg font-semibold text-cyan-700 mb-2">{currentCrew.name}</h3>
            <div className="flex items-center gap-2">
              <span className="px-4 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 drop-shadow">Activo</span>
              {/* //! Badge "Líder" si el usuario es el líder del equipo */}
              {currentCrew.leader === user._id && (
                <span className="px-4 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-700 drop-shadow">Líder</span>
              )}
            </div>
          </div>
        )}

        {/* //? Sección 2: Equipos anteriores */}
        <h2 className="text-2xl font-bold text-cyan-700 mb-4 tracking-tight drop-shadow">Equipos anteriores</h2>
        {pastCrews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <span className="text-gray-400">No tienes equipos anteriores registrados</span>
          </div>
        ) : (
          pastCrews.map((crew, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-xl shadow-md p-4 border w-full mb-3 hover:cursor-pointer transition-all duration-200
                ${selectedCrew?._id === crew._id ? "border-cyan-400 ring-2 ring-cyan-300" : "border-gray-200 hover:border-cyan-300 hover:shadow-lg"}
              `}
              onClick={() => setSelectedCrew(crew)}
            >
              <h3 className="text-base font-semibold text-cyan-700 mb-2">{crew.name}</h3>
              <span className="px-4 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 drop-shadow">Inactivo</span>
            </div>
          ))
        )}
      </div>

      {/* //? ======================================== */}
      {/* //? COLUMNA DERECHA: DETALLES DEL EQUIPO */}
      {/* //? ======================================== */}
      <div>
        <h2 className="text-2xl font-bold text-cyan-700 mb-4 tracking-tight drop-shadow">Detalles del equipo</h2>
        {!selectedCrew ? (
          <div className="flex flex-col items-center justify-center py-8">
            <span className="text-gray-400">Selecciona un equipo para ver detalles</span>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 border border-cyan-200 w-full">
            <h3 className="text-lg font-semibold text-cyan-700 mb-4">{selectedCrew.name}</h3>

            {/* //? Líder del equipo */}
            <div className="mb-4">
              <span className="font-semibold text-cyan-700 block mb-2">Líder:</span>
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
                <p className="text-cyan-800">{selectedCrew.leader?.profile?.first_name} {selectedCrew.leader?.profile?.last_name}</p>
                <p className="text-sm text-gray-600">{selectedCrew.leader?.username}</p>
              </div>
            </div>

            {/* //? Miembros del equipo */}
            <div className="mb-4">
              <span className="font-semibold text-cyan-700 block mb-2">Miembros ({selectedCrew.members?.length || 0}):</span>
              <div className="space-y-2">
                {selectedCrew.members && selectedCrew.members.length > 0 ? (
                  selectedCrew.members.map((member, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                    >
                      <p className="text-blue-800">{member?.profile?.first_name} {member?.profile?.last_name}</p>
                      <p className="text-sm text-gray-600">{member?.username}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No hay miembros asignados</p>
                )}
              </div>
            </div>

            {/* //? Estado del equipo */}
            <div className="mb-2">
              <span className="font-semibold text-cyan-700">Estado:</span>
              <span
                className={`ml-2 px-3 py-1 rounded-full text-white text-xs font-bold drop-shadow
                  ${selectedCrew.deleted_at ? "bg-red-500" : "bg-cyan-500"}
                `}
              >
                {selectedCrew.deleted_at ? "Inactivo" : "Activo"}
              </span>
            </div>

            {/* //? ID del equipo */}
            <div className="mb-2">
              <span className="font-semibold text-cyan-700">ID:</span>
              <span className="ml-2 text-cyan-700 font-mono text-sm">{selectedCrew._id}</span>
            </div>

            {/* //? Fecha de finalización (si está inactivo) */}
            {selectedCrew.deleted_at && (
              <div className="mb-2 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="font-semibold text-red-700 block mb-1">Fecha de finalización:</span>
                <span className="text-sm text-red-600">{new Date(selectedCrew.deleted_at).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerTeam;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * WorkerTeam = equipo de trabajador
 * getFetchData = obtener datos del fetch
 * useFetch = usar fetch
 * currentCrew = equipo actual
 * setCurrentCrew = establecer equipo actual
 * pastCrews = equipos pasados
 * setPastCrews = establecer equipos pasados
 * selectedCrew = equipo seleccionado
 * setSelectedCrew = establecer equipo seleccionado
 * user = usuario
 * UserContext = contexto de usuario
 * fetchCrews = obtener equipos
 * data = datos
 * crew = equipo
 * error = error
 * _id = identificador
 * name = nombre
 * leader = líder
 * idx = índice
 * members = miembros
 * member = miembro
 * profile = perfil
 * first_name = primer nombre
 * last_name = apellido
 * username = nombre de usuario
 * deleted_at = eliminado en (fecha)
 * toLocaleDateString = a fecha local en cadena
 */
