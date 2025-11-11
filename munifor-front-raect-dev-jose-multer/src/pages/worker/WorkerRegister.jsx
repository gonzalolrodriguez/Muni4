//* ========================================
//* PÁGINA: WorkerRegister
//* ========================================
//* Propósito: Registro de trabajadores (solo para admin/operator)
//* Ruta: /worker/register
//* Layout: AdminLayout / OperatorLayout
//* Características:
//*   - Usa el componente reutilizable FormRegister
//*   - Role: "Trabajador" (pasa como prop)
//*   - Requiere autenticación como admin u operador
//*   - Después del registro exitoso, redirige a lista de trabajadores

import FormRegister from "../../components/FormRegister";

const WorkerRegister = () => {
  //! Componente wrapper que usa FormRegister con role="Trabajador"
  return <FormRegister role={"Trabajador"} />;
};

export default WorkerRegister;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * WorkerRegister = registro de trabajador
 * FormRegister = formulario de registro
 * role = rol
 */
