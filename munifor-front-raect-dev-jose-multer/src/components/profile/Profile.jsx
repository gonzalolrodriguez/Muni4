//* ========================================
//* COMPONENTE: Profile
//* ========================================
//* Propósito: Página de perfil del usuario autenticado
//* Usado en: Todas las páginas de perfil (CitizenProfile, WorkerProfile, OperatorProfile, AdminProfile)
//* Funcionalidad:
//*   - Muestra información personal del usuario
//*   - Permite editar perfil (toggle entre vista y formulario)
//*   - Muestra rol, fecha de registro, imagen
//*   - Botón "Cambiar contraseña" (pendiente de implementar)
//* Estados:
//*   - userData: objeto - Datos completos del usuario desde el servidor
//*   - updateProfile: boolean - true=vista lectura, false=formulario edición

import userNotImagen from "../../assets/img/images.png";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import useFetch from "../../hooks/useFetch";
import { formatDate } from "../../utils/formatDate";
import UpdateProfile from "./UpdateProfile";

const Profile = () => {
  const { user } = useContext(UserContext);
  const { getFetchData } = useFetch();
  const [userData, setUserData] = useState(null);
  const [updateProfile, setUpdateProfile] = useState(true); // true=ver, false=editar

  //* ========================================
  //* EFFECT: Cargar datos del usuario al montar o cambiar updateProfile
  //* ========================================
  useEffect(() => {
    const fetchUser = async () => {
      if (!user?._id) return;
      try {
        //! Obtener datos completos del usuario desde el servidor
        const data = await getFetchData(`/user/${user._id}`);
        if (data.ok) setUserData(data.user);
      } catch (err) {
        console.error(err);
        setUserData(null);
      }
    };
    fetchUser();
    //? Re-ejecutar cuando updateProfile cambie (después de editar)
  }, [user, updateProfile]);

  //* Formatear fecha de registro
  const formattedDate = formatDate(userData?.created_at);

  //* ========================================
  //* CALLBACK: Volver a vista de lectura después de editar
  //* ========================================
  const handleUpdate = () => {
    setUpdateProfile(true);
  };

  return (
    <div className="min-h-screen bg-[#eaf4fe] py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-8 mb-8 border border-cyan-200">
          <h2 className="text-4xl font-extrabold text-cyan-700 mb-2 text-center drop-shadow">Mi Perfil</h2>
          <p className="text-cyan-600 mb-6 text-center text-lg">
            Gestiona tu información personal y configuración de cuenta
          </p>


          {/* //? ======================================== */}
          {/* //? MODO: Vista de lectura (updateProfile=true) */}
          {/* //? ======================================== */}
          {updateProfile ? (
            <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
              {/* //? SECCIÓN 1: Imagen, rol y fecha de registro */}
              <div className="flex flex-col items-center bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl p-6 w-full md:w-1/3 shadow-md border border-cyan-200">
                <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center mb-4 border-4 border-cyan-400 shadow-lg">
                  <img src={userData?.image || userNotImagen} alt="avatar" className="object-cover w-full h-full" />
                </div>
                <p className="font-bold text-xl text-cyan-700 mb-1 capitalize">
                  {userData?.role || "Rol no disponible"}
                </p>
                <p className="text-cyan-600 text-md mt-2">
                  Miembro desde: <span className="font-semibold">{formattedDate || "Fecha no disponible"}</span>
                </p>
              </div>

              {/* //? SECCIÓN 2: Información personal */}
              <div className="flex-1 bg-cyan-50 rounded-2xl p-6 shadow-md border border-cyan-100">
                <h3 className="text-2xl font-bold text-cyan-700 mb-4">Información Personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-6">
                  <p className="text-lg font-medium text-cyan-700">
                    Nombre: <span className="font-normal">{userData?.profile?.first_name || "No especificado"}</span>
                  </p>
                  <p className="text-lg font-medium text-cyan-700">
                    Apellido: <span className="font-normal">{userData?.profile?.last_name || "No especificado"}</span>
                  </p>
                  <p className="text-lg font-medium text-cyan-700">
                    Email: <span className="font-normal">{userData?.email || "No especificado"}</span>
                  </p>
                  <p className="text-lg font-medium text-cyan-700">
                    Teléfono: <span className="font-normal">{userData?.profile?.phone || "No especificado"}</span>
                  </p>
                  <p className="text-lg font-medium text-cyan-700">
                    Edad: <span className="font-normal">{userData?.profile?.age !== undefined ? userData.profile.age : "No especificada"}</span>
                  </p>
                  <p className="text-lg font-medium text-cyan-700">
                    Dirección: <span className="font-normal">{userData?.profile?.address || "No especificada"}</span>
                  </p>
                  <p className="text-lg font-medium text-cyan-700">
                    Sexo: <span className="font-normal">{userData?.profile?.sex || "No especificado"}</span>
                  </p>
                </div>
                {/* //! Botón para activar modo edición */}
                <button
                  className="px-6 py-2 bg-cyan-600 text-white rounded-xl font-bold text-lg hover:bg-cyan-700 transition w-full md:w-auto"
                  onClick={() => setUpdateProfile(false)}
                >
                  Editar Información
                </button>
              </div>
            </div>
          ) : (
            /* //? ======================================== */
            /* //? MODO: Formulario de edición (updateProfile=false) */
            /* //? ======================================== */
            <UpdateProfile onUpdate={handleUpdate} />
          )}

          {/* //? ======================================== */}
          {/* //? SECCIÓN 3: Seguridad (siempre visible) */}
          {/* //? ======================================== */}
          <div className="bg-cyan-50 rounded-2xl p-6 shadow-md border border-cyan-100 mt-4">
            <h3 className="text-2xl font-bold text-cyan-700 mb-4">Seguridad</h3>
            {/* //TODO: Implementar funcionalidad de cambiar contraseña */}
            <button className="px-6 py-2 bg-cyan-600 text-white rounded-xl font-bold text-lg hover:bg-cyan-700 transition w-full md:w-auto">
              Cambiar contraseña
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * Profile = perfil
 * user = usuario
 * userData = datos de usuario
 * updateProfile = actualizar perfil
 * getFetchData = obtener datos (GET)
 * formatDate = formatear fecha
 * handleUpdate = manejar actualización
 * formattedDate = fecha formateada
 * userNotImagen = imagen por defecto de usuario
 * image = imagen
 * role = rol
 * created_at = creado en
 * profile = perfil
 * first_name = nombre
 * last_name = apellido
 * email = correo electrónico
 * phone = teléfono
 * age = edad
 * address = dirección
 * sex = sexo
 */
