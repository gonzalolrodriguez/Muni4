//! ========================================
//! ADMIN PROFILE - PÁGINA DE PERFIL DEL ADMINISTRADOR
//! ========================================
//* Propósito: Página wrapper que renderiza el componente Profile para administradores
//* Ruta: /admin/profile
//* Layout: AdminLayout (con AdminNavBar)
//* Características:
//*   - Reutiliza componente Profile genérico
//*   - Muestra información personal del administrador
//*   - Permite actualización de datos del administrador

import Profile from "../../components/profile/Profile";

//? ========================================
//? COMPONENTE PRINCIPAL - ADMINPROFILE
//? ========================================
//* Descripción: Wrapper simple que renderiza el componente Profile reutilizable
//* @returns {JSX.Element} - Componente Profile para administradores
//* Uso: Página accesible desde navbar del administrador
const AdminProfile = () => {
  return <Profile />;
};
export default AdminProfile;

//! ========================================
//! TRADUCCIÓN DE CONSTANTES
//! ========================================
//* Profile - Perfil
//* Admin - Administrador
