//* ========================================
//* COMPONENTE: CrewDetails
//* ========================================
//* Propósito: Modal con detalles de una cuadrilla
//* Usado en: Operator/Admin páginas de equipos
//* Props:
//*   - crew: objeto - Cuadrilla completa con name, leader, members, etc.
//*   - onClose: función - Cerrar el modal
//* Diseño: Modal centrado con scroll vertical

const CrewDetails = ({ crew, onClose }) => {
  console.log(crew);
  return (
    <div className="flex flex-col w-full max-h-[70vh] overflow-y-auto">
      {/* Header con título */}
      <h2 className="text-2xl font-bold mb-4 text-center">
        Detalles de la Cuadrilla
      </h2>

      {/* Contenido con detalles de la cuadrilla */}
      <div className="flex flex-col gap-3">
        <p>
          <span className="font-semibold">Nombre:</span>{" "}
          {crew?.name || <span className="text-gray-400">Sin nombre</span>}
        </p>
        <p>
          <span className="font-semibold">Líder:</span>{" "}
          {crew?.leader?.username || (
            <span className="text-gray-400">Sin líder</span>
          )}
        </p>
        {/* Miembros: Lista separada por comas */}
        <p>
          <span className="font-semibold">Miembros:</span>{" "}
          {crew?.members?.length > 0
            ? crew.members.map((member) => member.username).join(", ")
            : "Sin miembros"}
        </p>
      </div>
    </div>
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
