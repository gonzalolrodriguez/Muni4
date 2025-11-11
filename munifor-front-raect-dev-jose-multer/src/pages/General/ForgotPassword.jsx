//* ========================================
//* PÁGINA: ForgotPassword
//* ========================================
//* Propósito: Formulario para recuperar contraseña olvidada
//* Ruta: /forgot-password
//* Layout: GeneralLayout
//* Características:
//*   - Solicita email del usuario
//*   - TODO: Enviar email de recuperación al backend
//*   - TODO: Agregar validación con Zod
//*   - TODO: Mostrar mensaje de éxito/error

import { useForm } from "react-hook-form";

const ForgotPassword = () => {
  //* ========================================
  //* FORMULARIO
  //* ========================================
  const { register, handleSubmit } = useForm();

  //* ========================================
  //* SUBMIT: Enviar email de recuperación
  //* ========================================
  const onSubmit = (data) => {
    console.log(data);
    //TODO: Enviar petición al backend para enviar email de recuperación
    //TODO: Mostrar mensaje de éxito o error
  };

  return (
    <section className="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-blue-50 to-blue-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6"
      >
        <h1 className="text-2xl font-bold text-blue-700 mb-2">
          Recuperar contraseña
        </h1>

        {/* //? Campo de email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            id="email"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingresa tu correo electrónico"
          />
          {/* //TODO: Agregar validación y mostrar errores */}
        </div>

        {/* //? Botón de envío */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Enviar
          </button>
        </div>
      </form>
    </section>
  );
};

export default ForgotPassword;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * ForgotPassword = contraseña olvidada
 * register = registrar (campo del formulario)
 * handleSubmit = manejar envío
 * onSubmit = al enviar
 * data = datos
 */
