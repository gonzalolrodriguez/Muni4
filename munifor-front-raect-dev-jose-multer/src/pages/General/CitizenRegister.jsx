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
  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Regístrate como Ciudadano
      </h1>
      <FormRegister role={"Ciudadano"} />
    </div>
  );
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
