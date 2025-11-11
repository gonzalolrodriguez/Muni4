//* ========================================
//* PÁGINA: UpdatePassword
//* ========================================
//* Propósito: Formulario para restablecer contraseña
//* Ruta: /update-password (acceso desde link de email)
//* Layout: GeneralLayout
//* Características:
//*   - Validación con Zod (UpdatePasswordSchema)
//*   - Verifica que ambas contraseñas coincidan
//*   - Elimina confirmpassword antes de enviar al backend
//*   - Redirecciona a /login después de éxito
//*   - TODO: Enviar petición al backend para actualizar contraseña

import { zodResolver } from "@hookform/resolvers/zod";
import updatePasswordShema from "../../schemas/UpdatePasswordShema";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  //* ========================================
  //* FORMULARIO CON VALIDACIÓN ZOD
  //* ========================================
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(updatePasswordShema),
    mode: "onChange", // Validar en tiempo real
  });

  //? Extraer errores de validación
  const { errors } = formState;

  //* ========================================
  //* NAVEGACIÓN
  //* ========================================
  const navigate = useNavigate();

  //* ========================================
  //* SUBMIT: Actualizar contraseña
  //* ========================================
  const onSubmit = (data) => {
    console.log(data);

    //! Eliminar confirmpassword (no se envía al backend)
    const { confirmpassword, ...dataDB } = data;
    console.log(dataDB);

    //TODO: Enviar petición al backend para actualizar contraseña
    //TODO: Verificar token de recuperación

    //? Redireccionar al login después de éxito
    navigate("/login");
  };

  //* ========================================
  //* RENDER
  //* ========================================
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Reestablece tu contraseña</h1>

      {/* //? Campo: Nueva contraseña */}
      <div>
        <label htmlFor="password">Nueva contraseña</label>
        <input
          type="password"
          {...register("password")}
          id="password"
          className="border"
        />
        {/* //! Mostrar error de validación si existe */}
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}
      </div>

      {/* //? Campo: Confirmar contraseña */}
      <div>
        <label htmlFor="confirmpassword">Confirmar contraseña</label>
        <input
          type="password"
          {...register("confirmpassword")}
          id="confirmpassword"
          className="border"
        />
        {/* //! Mostrar error si las contraseñas no coinciden */}
        {errors.confirmpassword && (
          <span className="text-red-500 text-sm">
            {errors.confirmpassword.message}
          </span>
        )}
      </div>

      {/* //? Botón de envío */}
      <div>
        <button type="submit">Enviar </button>
      </div>
    </form>
  );
};

export default UpdatePassword;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * UpdatePassword = actualizar contraseña
 * zodResolver = resolvedor de Zod
 * updatePasswordShema = esquema de actualizar contraseña
 * register = registrar (campo del formulario)
 * handleSubmit = manejar envío
 * formState = estado del formulario
 * mode = modo
 * onChange = al cambiar
 * errors = errores
 * navigate = navegar
 * onSubmit = al enviar
 * data = datos
 * confirmpassword = confirmar contraseña
 * dataDB = datos para la base de datos
 * password = contraseña
 * message = mensaje
 */
