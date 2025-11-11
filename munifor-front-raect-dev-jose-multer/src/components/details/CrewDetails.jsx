//* ========================================
//* COMPONENTE: CrewDetails
//* ========================================
//* Propósito: Panel lateral (aside) con detalles de una cuadrilla
//* Usado en: Operator/Admin páginas de equipos, mapas con cuadrillas
//* Props:
//*   - crew: objeto - Cuadrilla completa con name, leader, members, etc.
//*   - onClose: función - Cerrar el panel lateral
//* Diseño: Panel absoluto a la derecha con scroll vertical

const CrewDetails = ({ crew, onClose }) => {
  console.log(crew);
  return (
    //* Panel lateral fijo a la derecha, ocupa toda la altura
    <section
      className="absolute top-0 right-0 h-full max-w-md w-full bg-white shadow-2xl z-40 flex flex-col border-l border-gray-200"
      style={{ position: "absolute" }}
    >
      {/* //? Header con título y botón cerrar */}
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Detalles de la Cuadrilla</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          ✕
        </button>
      </div>

      {/* //? Contenido scrolleable con detalles de la cuadrilla */}
      <div className="p-6 flex-1 overflow-y-auto">
        <p>
          <span className="font-semibold">Nombre:</span> {crew?.name}
        </p>
        <p>
          <span className="font-semibold">Líder:</span> {crew?.leader?.username}
        </p>
        {/* //? Miembros: Lista separada por comas */}
        <p>
          <span className="font-semibold">Miembros:</span>{" "}
          {crew?.members?.map((member) => member.username).join(", ")}
        </p>
        {/* //? Se pueden agregar más campos según necesidad */}
      </div>
    </section>
  );
};

export default CrewDetails;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * CrewDetails = detalles de cuadrilla
 * crew = cuadrilla / equipo
 * onClose = al cerrar
 * name = nombre
 * leader = líder / jefe
 * members = miembros
 * username = nombre de usuario
 */
