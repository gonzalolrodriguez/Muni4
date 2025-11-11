//* ========================================
//* PÁGINA: WorkerProfile
//* ========================================
//* Propósito: Perfil del trabajador
//* Ruta: /worker/profile
//* Layout: WorkerLayout
//* Características:
//*   - Usa el componente reutilizable Profile
//*   - Muestra/edita información personal del trabajador
//*   - Incluye imagen, geolocalización, datos personales

import Profile from "../../components/profile/Profile";

const WorkerProfile = () => {
  //! Componente wrapper que usa Profile (reutilizable para todos los roles)
  return <Profile />;
};

export default WorkerProfile;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * WorkerProfile = perfil de trabajador
 * Profile = perfil
 */
