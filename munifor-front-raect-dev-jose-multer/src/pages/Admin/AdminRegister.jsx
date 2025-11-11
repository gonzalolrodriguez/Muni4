//! ========================================
//! ADMIN REGISTER - REGISTRO DE NUEVOS ADMINISTRADORES
//! ========================================
//* Propósito: Página para que administradores registren nuevos usuarios administradores
//* Ruta: /admin/register
//* Layout: AdminLayout (con AdminNavBar)
//* Características:
//*   - Reutiliza componente FormRegister con role="Administrador"
//*   - Formulario de registro con validación (nombre, email, DNI, teléfono, dirección)
//*   - Solo accesible para administradores autenticados

import FormRegister from "../../components/FormRegister";

//? ========================================
//? COMPONENTE PRINCIPAL - ADMINREGISTER
//? ========================================
//* Descripción: Wrapper que renderiza FormRegister pre-configurado para rol Administrador
//* @returns {JSX.Element} - Formulario de registro con role="Administrador"
//* Uso: Administradores pueden crear cuentas para otros administradores
const AdminRegister = () => {
  //? Renderiza FormRegister con role fijo "Administrador"
  return <FormRegister role={"Administrador"} />;
};
export default AdminRegister;

//! ========================================
//! TRADUCCIÓN DE CONSTANTES
//! ========================================
//* FormRegister - Formulario de Registro
//* role - rol
//* Administrador - Admin (en backend)
