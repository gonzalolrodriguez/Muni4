//* ========================================
//* COMPONENTE: Pagination
//* ========================================
//* Propósito: Componente reutilizable de paginación
//* Usado en: ReportStatus, AdminProfileSearch, OperatorReports, etc.
//* Props:
//*   - currentPage: Página actual
//*   - totalPages: Total de páginas
//*   - onPageChange: Función callback para cambiar de página
//*   - scrollToTop: Boolean - si debe hacer scroll al cambiar página (default: false)

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  scrollToTop = false,
}) => {
  //* ========================================
  //* HANDLERS
  //* ========================================
  const handlePageChange = (newPage) => {
    onPageChange(newPage);
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  //* Calcular si hay página siguiente
  const hasMore = currentPage < totalPages;

  //* Si solo hay 1 página, no mostrar controles
  if (totalPages <= 1) return null;

  //* ========================================
  //* RENDER
  //* ========================================
  return (
    <div className="flex justify-center items-center gap-3 py-4">
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-xl font-semibold shadow-md transition ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-cyan-600 text-white hover:bg-cyan-700"
        }`}
      >
        Inicio
      </button>
      <button
        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className={`px-5 py-2 rounded-xl font-semibold shadow-md transition ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-cyan-600 text-white hover:bg-cyan-700"
        }`}
      >
        Anterior
      </button>
      <span className="text-cyan-700 font-bold text-lg px-3">
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
        disabled={!hasMore}
        className={`px-5 py-2 rounded-xl font-semibold shadow-md transition ${
          !hasMore
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-cyan-600 text-white hover:bg-cyan-700"
        }`}
      >
        Siguiente
      </button>
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={!hasMore}
        className={`px-4 py-2 rounded-xl font-semibold shadow-md transition ${
          !hasMore
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-cyan-600 text-white hover:bg-cyan-700"
        }`}
      >
        Final
      </button>
    </div>
  );
};

export default Pagination;

//* ========================================
//* EJEMPLO DE USO
//* ========================================
/*
import Pagination from '../../components/Pagination';

// En el componente:
<Pagination 
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>

// Con scroll al inicio:
<Pagination 
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  scrollToTop={true}
/>
*/
