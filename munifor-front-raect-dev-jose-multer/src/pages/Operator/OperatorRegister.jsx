//! ========================================
//! OPERATOR REGISTER - REGISTRO DE NUEVOS OPERADORES
//! ========================================
//* Propósito: Página para que operadores registren nuevos usuarios operadores
//* Ruta: /operator/register
//* Layout: OperatorLayout (con OperatorNavBar)
//* Características:
//*   - Reutiliza componente FormRegister con role="Operador"
//*   - Formulario de registro con validación (nombre, email, DNI, teléfono, dirección)
//*   - Solo accesible para operadores autenticados

import FormRegister from "../../components/FormRegister";

//? ========================================
//? COMPONENTE PRINCIPAL - OPERATORREGISTER
//? ========================================
//* Descripción: Wrapper que renderiza FormRegister pre-configurado para rol Operador
//* @returns {JSX.Element} - Formulario de registro con role="Operador"
//* Uso: Operadores pueden crear cuentas para otros operadores
const OperatorRegister = () => {
  //? Renderiza FormRegister con role fijo "Operador"
  return <FormRegister role={"Operador"} />;
};
export default OperatorRegister;

//! ========================================
//! TRADUCCIÓN DE CONSTANTES
//! ========================================
//* FormRegister - Formulario de Registro
//* role - rol
//* Operador - Operator (en backend)
