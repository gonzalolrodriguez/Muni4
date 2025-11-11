//* ========================================
//* COMPONENTE: AsideDetailsPanel
//* ========================================
//* Propósito: Panel lateral deslizable tipo Jira para mostrar detalles completos
//* Usado en: Mapas globales (OperatorMap, AdminMap) al hacer click en marcador
//* Props:
//*   - isOpen: boolean - Controla si el panel está visible
//*   - onClose: función - Callback para cerrar el panel
//*   - selectedItem: objeto - Item seleccionado (report/task/progress)
//*   - dataType: string - Tipo de dato ("report" | "task" | "progress")
//* Características:
//*   - Overlay oscuro para cerrar al hacer click fuera
//*   - Panel deslizable desde la derecha con animación
//*   - Renderiza componente de detalles según dataType
//*   - Responsive: ocupa 100% en móvil, hasta 40% en desktop

import ReportDetails from "../details/ReportDetails";
import TaskDetails from "../details/TaskDetails";
import AdvancedDetails from "../details/AdvancedDetails";

const AsideDetailsPanel = ({ isOpen, onClose, selectedItem, dataType }) => {
  //? Si no está abierto o no hay item, no renderizar nada
  if (!isOpen || !selectedItem) return null;

  return (
    <>
      {/* //? ======================================== */}
      {/* //? OVERLAY: Fondo oscuro para cerrar */}
      {/* //? ======================================== */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* //! ======================================== */}
      {/* //! PANEL LATERAL: Deslizable desde la derecha */}
      {/* //! ======================================== */}
      <aside
        className={`fixed top-0 right-0 h-full w-full md:w-2/3 lg:w-1/2 xl:w-2/5 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* //? Header con título y botón cerrar */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            {dataType === "report" && "Detalles del Reporte"}
            {dataType === "task" && "Detalles de la Tarea"}
            {dataType === "progress" && "Detalles del Avance"}
          </h2>{" "}
          {/* //? Botón cerrar con icono SVG */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Cerrar panel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* //! ======================================== */}
        {/* //! CONTENIDO: Renderizar componente según dataType */}
        {/* //! ======================================== */}
        <div className="p-6">
          {/* //? Caso 1: Reporte */}
          {dataType === "report" && (
            <ReportDetails reportId={selectedItem._id} />
          )}
          {/* //? Caso 2: Tarea */}
          {dataType === "task" && <TaskDetails taskId={selectedItem._id} />}
          {/* //? Caso 3: Avance */}
          {dataType === "progress" && (
            <AdvancedDetails progressId={selectedItem._id} />
          )}
        </div>
      </aside>
    </>
  );
};

export default AsideDetailsPanel;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * AsideDetailsPanel = panel lateral de detalles
 * isOpen = está abierto
 * onClose = al cerrar
 * selectedItem = elemento seleccionado
 * dataType = tipo de dato
 * ReportDetails = detalles de reporte
 * TaskDetails = detalles de tarea
 * AdvancedDetails = detalles avanzados
 * reportId = identificador de reporte
 * taskId = identificador de tarea
 * progressId = identificador de avance
 * _id = identificador
 */
