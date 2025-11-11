//* ========================================
//* COMPONENTE: ProfileDetails
//* ========================================
//* Propósito: Card detallado de perfil de usuario
//* Usado en: AdminProfileSearch, RegistrationRequests (aprobar/rechazar usuarios)
//* Props:
//*   - user: objeto - Usuario completo con profile, role, email, created_at, etc.
//*   - showActions: boolean - Mostrar botones Aceptar/Rechazar (default: false)
//*   - onAccept: función - Callback al aceptar usuario
//*   - onReject: función - Callback al rechazar usuario
//* Secciones:
//*   1. Información de cuenta: username, email, rol
//*   2. Datos personales: DNI, edad, sexo, teléfono, dirección
//*   3. Estado: is_active, is_available
//*   4. Fecha de registro
//*   5. ID
//*   6. Botones de acción (condicional con showActions)

const ProfileDetails = ({ user, showActions = false, onAccept, onReject }) => {
  //? Si no hay usuario, no renderizar nada
  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200 w-full">
      {/* //? Header con nombre completo */}
      <h3 className="text-lg font-semibold text-indigo-700 mb-4">
        {user.profile?.first_name} {user.profile?.last_name}
      </h3>

      {/* //? ======================================== */}
      {/* //? SECCIÓN 1: Información de cuenta */}
      {/* //? ======================================== */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">
          Información de cuenta
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Usuario:</span>
            <span className="text-sm font-medium">{user.username}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Email:</span>
            <span className="text-sm font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Rol:</span>
            {/* //! Badge con color según rol */}
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                user.role === "Administrador"
                  ? "bg-red-100 text-red-700"
                  : user.role === "Operador"
                  ? "bg-blue-100 text-blue-700"
                  : user.role === "Trabajador"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* //? ======================================== */}
      {/* //? SECCIÓN 2: Datos personales */}
      {/* //? ======================================== */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">Datos personales</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">DNI:</span>
            <span className="text-sm font-medium">{user.profile?.dni}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Edad:</span>
            <span className="text-sm font-medium">{user.profile?.age}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Sexo:</span>
            <span className="text-sm font-medium">{user.profile?.sex}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Teléfono:</span>
            <span className="text-sm font-medium">{user.profile?.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Dirección:</span>
            <span className="text-sm font-medium">{user.profile?.address}</span>
          </div>
        </div>
      </div>

      {/* //? ======================================== */}
      {/* //? SECCIÓN 3: Estados (is_active, is_available) */}
      {/* //? ======================================== */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">Estado</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Cuenta activa:</span>
            {/* //! Badge verde/rojo según is_active */}
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                user.is_active
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {user.is_active ? "Sí" : "No"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Disponible:</span>
            {/* //! Badge verde/amarillo según is_available */}
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                user.is_available
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {user.is_available ? "Sí" : "No"}
            </span>
          </div>
        </div>
      </div>

      {/* //? ======================================== */}
      {/* //? SECCIÓN 4: Fecha de registro */}
      {/* //? ======================================== */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">Fecha de registro:</span>
        <p className="text-sm font-medium mt-1">
          {new Date(user.created_at).toLocaleString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* //? ======================================== */}
      {/* //? SECCIÓN 5: ID del usuario */}
      {/* //? ======================================== */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">ID:</span>
        <p className="text-xs text-gray-700 font-mono mt-1">{user._id}</p>
      </div>

      {/* //! ======================================== */}
      {/* //! BOTONES DE ACCIÓN: Solo si showActions=true */}
      {/* //! ======================================== */}
      {showActions && (
        <div className="flex gap-3 mt-6">
          {/* //! Aceptar: Aprobar usuario (activar cuenta) */}
          <button
            onClick={() => onAccept(user._id)}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
          >
            Aceptar
          </button>
          {/* //! Rechazar: Denegar solicitud de registro */}
          <button
            onClick={() => onReject(user._id)}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
          >
            Rechazar
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * ProfileDetails = detalles de perfil
 * user = usuario
 * showActions = mostrar acciones
 * onAccept = al aceptar
 * onReject = al rechazar
 * profile = perfil
 * first_name = nombre
 * last_name = apellido
 * username = nombre de usuario
 * email = correo electrónico
 * role = rol
 * dni = documento nacional de identidad
 * age = edad
 * sex = sexo
 * phone = teléfono
 * address = dirección
 * is_active = está activo
 * is_available = está disponible
 * created_at = creado en
 * _id = identificador
 */
