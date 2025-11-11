//* ========================================
//* PÁGINA: CitizenProfile
//* ========================================
//* Propósito: Perfil del ciudadano
//* Ruta: /citizen/profile
//* Layout: CitizenLayout
//* Características:
//*   - Usa el componente reutilizable Profile
//*   - Muestra/edita información personal del ciudadano
//*   - Incluye imagen, geolocalización, datos personales

import Profile from "../../components/profile/Profile";

const CitizenProfile = () => {
  //! Componente wrapper que usa Profile (reutilizable para todos los roles)
  return <Profile />;
};

export default CitizenProfile;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * CitizenProfile = perfil de ciudadano
 * Profile = perfil
 */
