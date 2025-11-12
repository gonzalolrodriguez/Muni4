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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-cyan-200 p-8 w-full max-w-2xl mx-auto animate-fade-in"
    >
      <h2 className="text-3xl font-extrabold text-cyan-700 mb-6 text-center drop-shadow">Editar datos personales</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
        <div>
          <label htmlFor="firstname" className="block text-cyan-700 font-semibold mb-1">Nombre</label>
          <input
            type="text"
            {...register("first_name")}
            id="firstname"
            className="w-full px-4 py-2 rounded-xl border border-cyan-300 focus:ring-2 focus:ring-cyan-400 bg-white/90 text-cyan-700 shadow"
            placeholder="Nombre"
          />
        </div>
        <div>
          <label htmlFor="lastname" className="block text-cyan-700 font-semibold mb-1">Apellido</label>
          <input
            type="text"
            {...register("last_name")}
            id="lastname"
            className="w-full px-4 py-2 rounded-xl border border-cyan-300 focus:ring-2 focus:ring-cyan-400 bg-white/90 text-cyan-700 shadow"
            placeholder="Apellido"
          />
        </div>
        <div>
          <label htmlFor="age" className="block text-cyan-700 font-semibold mb-1">Edad</label>
          <input
            type="number"
            {...register("age")}
            id="age"
            className="w-full px-4 py-2 rounded-xl border border-cyan-300 focus:ring-2 focus:ring-cyan-400 bg-white/90 text-cyan-700 shadow"
            placeholder="Edad"
          />
        </div>
        <div>
          <label htmlFor="dni" className="block text-cyan-700 font-semibold mb-1">DNI</label>
          <input
            type="text"
            {...register("dni")}
            id="dni"
            className="w-full px-4 py-2 rounded-xl border border-cyan-300 focus:ring-2 focus:ring-cyan-400 bg-white/90 text-cyan-700 shadow"
            placeholder="DNI"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-cyan-700 font-semibold mb-1">Teléfono</label>
          <input
            type="text"
            {...register("phone")}
            id="phone"
            className="w-full px-4 py-2 rounded-xl border border-cyan-300 focus:ring-2 focus:ring-cyan-400 bg-white/90 text-cyan-700 shadow"
            placeholder="Teléfono"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-cyan-700 font-semibold mb-1">Dirección</label>
          <input
            type="text"
            {...register("address")}
            id="address"
            className="w-full px-4 py-2 rounded-xl border border-cyan-300 focus:ring-2 focus:ring-cyan-400 bg-white/90 text-cyan-700 shadow"
            placeholder="Dirección"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="sex" className="block text-cyan-700 font-semibold mb-1">Sexo</label>
          <select
            {...register("sex")}
            id="sex"
            className="w-full px-4 py-2 rounded-xl border border-cyan-300 focus:ring-2 focus:ring-cyan-400 bg-white/90 text-cyan-700 shadow"
            defaultValue=""
          >
            <option value="" disabled>Seleccione</option>
            <option value="Hombre">Hombre</option>
            <option value="Mujer">Mujer</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-end mt-6">
        <button
          type="submit"
          className="px-6 py-2 bg-cyan-600 text-white rounded-xl font-bold text-lg hover:bg-cyan-700 shadow transition"
        >
          Guardar cambios
        </button>
        <button
          type="button"
          onClick={() => onUpdate(false)}
          className="px-6 py-2 bg-gray-200 text-cyan-700 rounded-xl font-bold text-lg hover:bg-gray-300 shadow transition"
        >
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
