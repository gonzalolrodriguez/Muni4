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
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Escribe tu correo electronico para recuperar tu contraseña</h1>

      {/* //? Campo de email */}
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          {...register("email")}
          id="email"
          className="border"
        />
        {/* //TODO: Agregar validación y mostrar errores */}
      </div>

      {/* //? Botón de envío */}
      <div>
        <button type="submit">Enviar</button>
      </div>
    </form>
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
