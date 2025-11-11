//* ========================================
//* COMPONENTE: GlobalLeafletMap
//* ========================================
//* Propósito: Mapa interactivo completo con filtros, marcadores y panel de detalles
//* Usado en: AdminMap, OperatorMap (vista completa del municipio)
//* Props:
//*   - role: string - Rol del usuario ("Operador", "Administrador")
//* Estructura del componente:
//*   - Panel izquierdo: Filtros (AsideFilterMap)
//*   - Centro: Mapa con marcadores (MapContainer)
//*   - Panel derecho: Detalles (ReportDetails - condicional)
//* Funcionalidad:
//*   - Carga datos del backend según rol (endpoint diferente)
//*   - Muestra marcadores de reportes, tareas o avances según filtro
//*   - Click en marcador: abre panel de detalles
//*   - Hover en marcador: muestra popup
//*   - Filtros dinámicos que actualizan marcadores
//* Endpoints:
//*   - Operador: /map/operator-data (solo su área)
//*   - Admin: /map/data (todos los datos)

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  getIconProgress,
  getIconReport,
  getIconTask,
} from "../../utils/getIconMap";
import useFetch from "../../hooks/useFetch";
import useFilter from "../../hooks/useFilter";
import { useEffect, useState } from "react";
import AsideFilterMap from "./AsideFilterMap";
import ReportDetails from "../details/ReportDetails";

const GlobalLeafletMap = ({ role }) => {
  //* ========================================
  //* ESTADO LOCAL
  //* ========================================
  //? Almacena todos los datos del backend (reportes, tareas, avances)
  const [allData, setAllData] = useState({
    reports: [],
    tasks: [],
    progress: [],
  });
  //? Filtros aplicados (dataType, status, type, priority, timeRange)
  const [filters, setFilters] = useState({ dataType: "report" });
  //? Reporte/tarea/avance seleccionado para mostrar detalles
  const [selectedReport, setSelectedReport] = useState(null);

  //* Hooks personalizados
  const { getFetchData } = useFetch();
  const { filterForMap } = useFilter();

  //* ========================================
  //* EFECTO: Cargar datos del backend al montar
  //* ========================================
  useEffect(() => {
    let isMounted = true; // Prevenir actualizaciones si se desmonta

    const fetchData = async () => {
      try {
        //! Endpoint específico según el rol del usuario
        const endpoint =
          role === "Operador" ? "/map/operator-data" : "/map/data";

        const data = await getFetchData(endpoint);

        if (isMounted) {
          console.log(data.tasks);
          //? Guardar datos separados por tipo
          setAllData({
            reports: data.reports || [],
            tasks: data.tasks || [],
            progress: data.progress || [],
          });
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error al cargar datos del mapa:", error);
          //? En caso de error, resetear datos
          setAllData({
            reports: [],
            tasks: [],
            progress: [],
          });
        }
      }
    };

    fetchData();

    //! Cleanup: marcar componente como desmontado
    return () => {
      isMounted = false;
    };
  }, [role]);

  //* ========================================
  //* HANDLERS
  //* ========================================
  //? Callback del panel de filtros
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  //? Callback al hacer click en un marcador
  const handleSelectReport = (reporte) => setSelectedReport(reporte);

  //? Callback para cerrar panel de detalles
  const closeModal = () => setSelectedReport(null);

  //* ========================================
  //* FILTRADO DE DATOS
  //* ========================================
  //! Aplicar filtros con useFilter.filterForMap
  const filteredData = filterForMap(allData, filters);

  //* ========================================
  //* RENDER
  //* ========================================
  return (
    <div className="flex h-screen">
      {/* //? ======================================== */}
      {/* //? PANEL IZQUIERDO - FILTROS */}
      {/* //? ======================================== */}
      <aside className="w-1/6 bg-gray-100 border-r border-gray-300 p-4 overflow-y-auto">
        <AsideFilterMap onFilters={handleApplyFilters} />
      </aside>

      {/* //? ======================================== */}
      {/* //? CONTENIDO CENTRAL - MAPA */}
      {/* //? ======================================== */}
      <main className="flex-1 relative">
        <MapContainer
          center={[-26.1849, -58.1731]} // Formosa, Argentina
          zoom={15}
          className="h-full w-full z-0"
        >
          {/* //? Capa de mosaicos (OpenStreetMap) */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
          />

          {/* //! ======================================== */}
          {/* //! MARCADORES SEGÚN TIPO DE DATO */}
          {/* //! ======================================== */}

          {/* //? CASO 1: Mostrar reportes */}
          {filters.dataType === "report"
            ? filteredData
                .filter((item) => item.location?.lat && item.location?.lng)
                .map((item) => (
                  <Marker
                    key={item._id}
                    position={[item.location.lat, item.location.lng]}
                    icon={getIconReport(
                      item.report_type?.toLowerCase() || "otros",
                      item.status?.toLowerCase()
                    )}
                    eventHandlers={{
                      //! Click: abrir panel de detalles
                      click: () => handleSelectReport(item),
                      //! Hover: abrir popup
                      mouseover: (e) => e.target.openPopup(),
                      mouseout: (e) => e.target.closePopup(),
                    }}
                  >
                    <Popup>
                      <div>
                        <b>{item.report_type?.toUpperCase()}</b>
                        <br />
                        <span>{item.title || item.description}</span>
                        {item.status && (
                          <>
                            <br />
                            <small className="text-gray-600">
                              Estado: {item.status}
                            </small>
                          </>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))
            : /* //? CASO 2: Mostrar tareas */
            filters.dataType === "task"
            ? filteredData
                .filter((item) => item.location?.lat && item.location?.lng)
                .map((item) => (
                  <Marker
                    key={item._id}
                    position={[item.location.lat, item.location.lng]}
                    icon={getIconTask(
                      item.task_type?.toLowerCase(),
                      item.priority?.toLowerCase()
                    )}
                    eventHandlers={{
                      click: () => handleSelectReport(item),
                      mouseover: (e) => e.target.openPopup(),
                      mouseout: (e) => e.target.closePopup(),
                    }}
                  >
                    <Popup>
                      <div>
                        <b>{item.task_type?.toUpperCase()}</b>
                        <br />
                        <span>{item.title || item.description}</span>
                        <br />
                        <small className="text-gray-600">
                          Estado: {item.status}
                        </small>
                      </div>
                    </Popup>
                  </Marker>
                ))
            : /* //? CASO 3: Mostrar avances */
              filters.dataType === "progress" &&
              filteredData
                .filter((item) => item.location?.lat && item.location?.lng)
                .map((item) => (
                  <Marker
                    key={item._id}
                    position={[item.location.lat, item.location.lng]}
                    icon={getIconProgress(item.status?.toLowerCase())}
                    eventHandlers={{
                      click: () => handleSelectReport(item),
                      mouseover: (e) => e.target.openPopup(),
                      mouseout: (e) => e.target.closePopup(),
                    }}
                  >
                    <Popup>
                      <div>
                        <b>PROGRESO</b>
                        <br />
                        <span>{item.worker?.name}</span>
                        <br />
                        <small className="text-gray-600">
                          Estado: {item.status}
                        </small>
                      </div>
                    </Popup>
                  </Marker>
                ))}
        </MapContainer>

        {/* //? ======================================== */}
        {/* //? PANEL DERECHO - DETALLES */}
        {/* //? ======================================== */}
        {/* //TODO: Variar según el tipo de dato (report/task/progress) */}
        {selectedReport && (
          <ReportDetails
            report={selectedReport}
            onClose={closeModal}
            role="Operador"
          />
        )}
      </main>
    </div>
  );
};

export default GlobalLeafletMap;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * GlobalLeafletMap = mapa de leaflet global
 * role = rol
 * allData = todos los datos
 * setAllData = establecer todos los datos
 * reports = reportes
 * tasks = tareas
 * progress = avances
 * filters = filtros
 * setFilters = establecer filtros
 * dataType = tipo de dato
 * selectedReport = reporte seleccionado
 * setSelectedReport = establecer reporte seleccionado
 * getFetchData = obtener datos del fetch
 * filterForMap = filtrar para mapa
 * isMounted = está montado
 * fetchData = obtener datos
 * endpoint = punto final (URL backend)
 * data = datos
 * handleApplyFilters = manejar aplicar filtros
 * newFilters = nuevos filtros
 * handleSelectReport = manejar seleccionar reporte
 * reporte = reporte
 * closeModal = cerrar modal
 * filteredData = datos filtrados
 * MapContainer = contenedor del mapa
 * center = centro
 * zoom = acercamiento
 * className = nombre de clase
 * TileLayer = capa de mosaicos
 * url = URL
 * attribution = atribución
 * item = elemento
 * location = ubicación
 * lat = latitud
 * lng = longitud
 * Marker = marcador
 * position = posición
 * icon = ícono
 * getIconReport = obtener ícono de reporte
 * getIconTask = obtener ícono de tarea
 * getIconProgress = obtener ícono de avance
 * report_type = tipo de reporte
 * toLowerCase = a minúsculas
 * toUpperCase = a mayúsculas
 * status = estado
 * eventHandlers = manejadores de eventos
 * click = click
 * mouseover = ratón encima
 * mouseout = ratón fuera
 * e = evento
 * target = objetivo
 * openPopup = abrir popup
 * closePopup = cerrar popup
 * Popup = popup
 * title = título
 * description = descripción
 * task_type = tipo de tarea
 * priority = prioridad
 * worker = trabajador
 * name = nombre
 * ReportDetails = detalles de reporte
 * report = reporte
 * onClose = al cerrar
 */
