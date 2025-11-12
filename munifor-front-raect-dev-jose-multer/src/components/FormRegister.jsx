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
      className="w-full max-w-xl mx-auto bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-10 flex flex-col gap-8 border-t-8 border-cyan-500 border border-cyan-200"
    >
      <h1 className="text-4xl font-extrabold text-cyan-700 mb-4 text-center tracking-tight drop-shadow">
        {role === "Ciudadano" ? "Regístrate como Ciudadano" : role === "Operador" ? "Registro de Operador" : role === "Trabajador" ? "Registro de Trabajador" : "Registro"}
      </h1>

      {/* //? ======================================== */}
      {/* //? SECCIÓN 1: Credenciales */}
      {/* //? ======================================== */}

      <div className="flex flex-col gap-2">
        <label htmlFor="username" className="block text-base font-semibold text-cyan-700 mb-1">Usuario</label>
        <input type="text" {...register("username")} id="username" className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg" />
        {errors.username && <span className="text-red-500 text-sm mt-1">{errors.username.message}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="block text-base font-semibold text-cyan-700 mb-1">Email</label>
        <input type="email" {...register("email")} id="email" className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg" />
        {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="block text-base font-semibold text-cyan-700 mb-1">Contraseña</label>
        <input type="password" {...register("password")} id="password" className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg" />
        {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="confirmpassword" className="block text-base font-semibold text-cyan-700 mb-1">Confirmar contraseña</label>
        <input type="password" {...register("confirmpassword")} id="confirmpassword" className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg" />
        {errors.confirmpassword && <span className="text-red-500 text-sm mt-1">{errors.confirmpassword.message}</span>}
      </div>

      {/* //? ======================================== */}
      {/* //? SECCIÓN 2: Datos personales (profile) */}
      {/* //? ======================================== */}
      <h2 className="text-2xl font-bold text-cyan-600 mt-6 mb-4 text-center">Datos personales</h2>

      <div className="flex flex-col gap-2">
        <label htmlFor="firstname" className="block text-base font-semibold text-cyan-700 mb-1">Nombre</label>
        <input type="text" {...register("first_name")} id="firstname" className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg" />
        {errors.first_name && <span className="text-red-500 text-sm mt-1">{errors.first_name.message}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="lastname" className="block text-base font-semibold text-cyan-700 mb-1">Apellido</label>
        <input type="text" {...register("last_name")} id="lastname" className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg" />
        {errors.last_name && <span className="text-red-500 text-sm mt-1">{errors.last_name.message}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="age" className="block text-base font-semibold text-cyan-700 mb-1">Edad</label>
        <input type="text" {...register("age")} id="age" className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg" />
        {errors.age && <span className="text-red-500 text-sm mt-1">{errors.age.message}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="dni" className="block text-base font-semibold text-cyan-700 mb-1">DNI</label>
        <input type="text" {...register("dni")} id="dni" className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg" />
        {errors.dni && <span className="text-red-500 text-sm mt-1">{errors.dni.message}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="phone" className="block text-base font-semibold text-cyan-700 mb-1">Teléfono</label>
        <input type="text" {...register("phone")} id="phone" className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg" />
        {errors.phone && <span className="text-red-500 text-sm mt-1">{errors.phone.message}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="address" className="block text-base font-semibold text-cyan-700 mb-1">Dirección</label>
        <input type="text" {...register("address")} id="address" className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg" />
        {errors.address && <span className="text-red-500 text-sm mt-1">{errors.address.message}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="sex" className="block text-base font-semibold text-cyan-700 mb-1">Sexo</label>
        <select {...register("sex")} defaultValue="" className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg">
          <option value="" disabled>Seleccione</option>
          <option value="Hombre">Hombre</option>
          <option value="Mujer">Mujer</option>
          <option value="Otro">Otro</option>
        </select>
        {errors.sex && <span className="text-red-500 text-sm mt-1">{errors.sex.message}</span>}
      </div>

      {/* //? ======================================== */}
      {/* //? BOTONES Y NAVEGACIÓN */}
      {/* //? ======================================== */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mt-6">
        <button type="submit" className="bg-cyan-600 text-white font-bold py-3 px-8 rounded-xl shadow hover:bg-cyan-700 transition text-lg">Registrar</button>
        <p className="text-base mt-2">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-cyan-600 hover:underline font-semibold">Inicia sesión</Link>
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
