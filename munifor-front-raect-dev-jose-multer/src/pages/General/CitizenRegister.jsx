//* ========================================
//* PÁGINA: CitizenRegister
//* ========================================
//* Propósito: Registro público para ciudadanos
//* Ruta: /register
//* Layout: GeneralLayout
//* Características:
//*   - Usa el componente reutilizable FormRegister
//*   - Role: "Ciudadano" (pasa como prop)
//*   - Accesible sin autenticación
//*   - Después del registro exitoso, redirige al login

import FormRegister from "../../components/FormRegister";

const CitizenRegister = () => {
  //! Componente wrapper que usa FormRegister con role="Ciudadano"
  return <FormRegister role={"Ciudadano"} />;
};

export default CitizenRegister;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * CitizenRegister = registro de ciudadano
 * FormRegister = formulario de registro
 * role = rol
 */
