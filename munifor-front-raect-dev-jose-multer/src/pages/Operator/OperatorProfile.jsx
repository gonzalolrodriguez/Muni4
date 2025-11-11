//! ========================================
//! OPERATOR PROFILE - PÁGINA DE PERFIL DEL OPERADOR
//! ========================================
//* Propósito: Página wrapper que renderiza el componente Profile para operadores
//* Ruta: /operator/profile
//* Layout: OperatorLayout (con OperatorNavBar)
//* Características:
//*   - Reutiliza componente Profile genérico
//*   - Muestra información personal del operador
//*   - Permite actualización de datos del operador

import Profile from "../../components/profile/Profile";

//? ========================================
//? COMPONENTE PRINCIPAL - OPERATORPROFILE
//? ========================================
//* Descripción: Wrapper simple que renderiza el componente Profile reutilizable
//* @returns {JSX.Element} - Componente Profile para operadores
//* Uso: Página accesible desde navbar del operador
const OperatorProfile = () => {
  return <Profile />;
};
export default OperatorProfile;

//! ========================================
//! TRADUCCIÓN DE CONSTANTES
//! ========================================
//* Profile - Perfil
//* Operator - Operador
