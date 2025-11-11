//* ========================================
//* COMPONENTE: FormRegister
//* ========================================
//* Propósito: Formulario de registro reutilizable para todos los roles
//* Usado en: CitizenRegister, WorkerRegister, OperatorRegister, AdminRegister
//* Props:
//*   - role: string - Rol del usuario a registrar ("Ciudadano", "Trabajador", "Operador", "Administrador")
//* Validación: RegisterSchema (11 campos con Zod)
//* Secciones:
//*   1. Credenciales: username, email, password, confirmpassword
//*   2. Datos personales: first_name, last_name, age, dni, phone, address, sex
//* Lógica especial:
//*   - Separa datos personales en objeto profile antes de enviar
//*   - Redirige a login después del registro

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import registerSchema from "../schemas/RegisterSchema.js";
import useFetch from "../hooks/useFetch.js";

const FormRegister = ({ role }) => {
  const { postFetch } = useFetch();
  const navigate = useNavigate();

  //* React Hook Form: Configuración con validación de Zod
  //? mode: "onChange" valida en tiempo real mientras el usuario escribe
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  //* Errores de validación del formulario
  const { errors } = formState;

  //* ========================================
  //* SUBMIT: Separar datos y enviar al servidor
  //* ========================================
  const onSubmit = (data) => {
    //? Desestructurar: separar profile de credenciales
    const { first_name, last_name, age, dni, phone, address, sex, ...rest } =
      data;

    //* Profile: objeto con datos personales
    const profile = { first_name, last_name, age, dni, phone, address, sex };

    //! Enviar: credenciales (username, email, password), role, y profile
    postFetch("/auth/register", { ...rest, role, profile });

    //* Redirigir al login después del registro
    navigate("/login");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6"
    >
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Regístrate como {role}
      </h1>

      {/* //? ======================================== */}
      {/* //? SECCIÓN 1: Credenciales */}
      {/* //? ======================================== */}

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Usuario
        </label>
        <input
          type="text"
          {...register("username")}
          id="username"
          className="input input-bordered w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.username && (
          <span className="text-red-500 text-sm">
            {errors.username.message}
          </span>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          type="email"
          {...register("email")}
          id="email"
          className="input input-bordered w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Contraseña
        </label>
        <input
          type="password"
          {...register("password")}
          id="password"
          className="input input-bordered w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmpassword"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Confirmar contraseña
        </label>
        <input
          type="password"
          {...register("confirmpassword")}
          id="confirmpassword"
          className="input input-bordered w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.confirmpassword && (
          <span className="text-red-500 text-sm">
            {errors.confirmpassword.message}
          </span>
        )}
      </div>

      {/* //? ======================================== */}
      {/* //? SECCIÓN 2: Datos personales (profile) */}
      {/* //? ======================================== */}
      <h2 className="text-xl font-semibold text-blue-600 mt-4 mb-2">
        Datos personales
      </h2>

      <div>
        <label
          htmlFor="firstname"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nombre
        </label>
        <input
          type="text"
          {...register("first_name")}
          id="firstname"
          className="input input-bordered w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.first_name && (
          <span className="text-red-500 text-sm">
            {errors.first_name.message}
          </span>
        )}
      </div>

      <div>
        <label
          htmlFor="lastname"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Apellido
        </label>
        <input
          type="text"
          {...register("last_name")}
          id="lastname"
          className="input input-bordered w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.last_name && (
          <span className="text-red-500 text-sm">
            {errors.last_name.message}
          </span>
        )}
      </div>

      <div>
        <label
          htmlFor="age"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Edad
        </label>
        <input
          type="text"
          {...register("age")}
          id="age"
          className="input input-bordered w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.age && (
          <span className="text-red-500 text-sm">{errors.age.message}</span>
        )}
      </div>

      <div>
        <label
          htmlFor="dni"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          DNI
        </label>
        <input
          type="text"
          {...register("dni")}
          id="dni"
          className="input input-bordered w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.dni && (
          <span className="text-red-500 text-sm">{errors.dni.message}</span>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Teléfono
        </label>
        <input
          type="text"
          {...register("phone")}
          id="phone"
          className="input input-bordered w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.phone && (
          <span className="text-red-500 text-sm">{errors.phone.message}</span>
        )}
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Dirección
        </label>
        <input
          type="text"
          {...register("address")}
          id="address"
          className="input input-bordered w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.address && (
          <span className="text-red-500 text-sm">{errors.address.message}</span>
        )}
      </div>

      <div>
        <label
          htmlFor="sex"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Sexo
        </label>
        <select
          {...register("sex")}
          defaultValue=""
          className="input input-bordered w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            Seleccione
          </option>
          <option value="Hombre">Hombre</option>
          <option value="Mujer">Mujer</option>
          <option value="Otro">Otro</option>
        </select>
        {errors.sex && (
          <span className="text-red-500 text-sm">{errors.sex.message}</span>
        )}
      </div>

      {/* //? ======================================== */}
      {/* //? BOTONES Y NAVEGACIÓN */}
      {/* //? ======================================== */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2 mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition"
        >
          Registrar
        </button>
        <p className="text-sm mt-2">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </form>
  );
};

export default FormRegister;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * FormRegister = formulario de registro
 * role = rol / papel
 * register (hook) = registrar campo
 * handleSubmit = manejar envío
 * formState = estado del formulario
 * errors = errores
 * postFetch = envío POST
 * navigate = navegar
 * data = datos
 * profile = perfil
 * first_name = nombre
 * last_name = apellido
 * age = edad
 * dni = documento nacional de identidad
 * phone = teléfono
 * address = dirección
 * sex = sexo
 * rest = resto (de los campos)
 */
