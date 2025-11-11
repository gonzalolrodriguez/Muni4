//* ========================================
//* COMPONENTE: UpdateProfile
//* ========================================
//* Propósito: Formulario para editar datos personales del perfil
//* Usado en: Profile.jsx (cuando el usuario hace click en "Editar")
//* Props:
//*   - onUpdate: función - Callback al guardar o cancelar (recibe true/false)
//* Campos editables:
//*   - first_name: string - Nombre
//*   - last_name: string - Apellido
//*   - age: number - Edad
//*   - dni: string - DNI
//*   - phone: string - Teléfono
//*   - address: string - Dirección
//*   - sex: enum - Sexo ("Hombre", "Mujer", "Otro")
//* Nota: Usa putFetchProfile del hook useFetch

import { useForm } from "react-hook-form";
import useFetch from "../../hooks/useFetch";

const UpdateProfile = ({ onUpdate }) => {
  const { register, handleSubmit } = useForm();
  const { putFetchProfile } = useFetch();

  //* ========================================
  //* SUBMIT: Enviar datos actualizados
  //* ========================================
  const onSubmit = (data) => {
    //! Enviar PUT a /auth/update/profile
    putFetchProfile("/auth/update/profile", data);
    console.log(data);

    //* Llamar callback onUpdate(false) para volver a vista de lectura
    onUpdate(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Datos personales</h1>

      {/* //? ======================================== */}
      {/* //? CAMPOS DEL FORMULARIO */}
      {/* //? ======================================== */}

      <div>
        <label htmlFor="firstname">Nombre</label>
        <input
          type="text"
          {...register("first_name")}
          id="firstname"
          className="border"
        />
      </div>

      <div>
        <label htmlFor="lastname">Apellido</label>
        <input
          type="text"
          {...register("last_name")}
          id="lastname"
          className="border"
        />
      </div>

      <div>
        <label htmlFor="age">Edad</label>
        <input type="text" {...register("age")} id="age" className="border" />
      </div>

      <div>
        <label htmlFor="dni">DNI</label>
        <input type="text" {...register("dni")} id="dni" className="border" />
      </div>

      <div>
        <label htmlFor="phone">Teléfono</label>
        <input
          type="text"
          {...register("phone")}
          id="phone"
          className="border"
        />
      </div>

      <div>
        <label htmlFor="address">Dirección</label>
        <input
          type="text"
          {...register("address")}
          id="address"
          className="border"
        />
      </div>

      {/* //? Select de sexo */}
      <div>
        <select {...register("sex")} defaultValue="">
          <option value="" disabled>
            Seleccione
          </option>
          <option value="Hombre">Hombre</option>
          <option value="Mujer">Mujer</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      {/* //? ======================================== */}
      {/* //? BOTONES DE ACCIÓN */}
      {/* //? ======================================== */}
      <div>
        <button type="submit">Guardar cambios</button>
      </div>
      <div>
        {/* //? Cancelar: Volver a vista de lectura sin guardar */}
        <button type="button" onClick={() => onUpdate(false)}>
          Cancelar
        </button>
      </div>
    </form>
  );
};
export default UpdateProfile;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * UpdateProfile = actualizar perfil
 * onUpdate = al actualizar
 * register = registrar (campo del formulario)
 * handleSubmit = manejar envío
 * putFetchProfile = PUT para actualizar perfil
 * data = datos
 * first_name = nombre
 * last_name = apellido
 * age = edad
 * dni = documento nacional de identidad
 * phone = teléfono
 * address = dirección
 * sex = sexo
 */
