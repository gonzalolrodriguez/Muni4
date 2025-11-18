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
import { useState } from "react";

const FormRegister = ({ role }) => {
  const { postFetch } = useFetch();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Credenciales, 2: Foto, 3: Datos personales
  const [formData, setFormData] = useState({});

  //* React Hook Form: Configuración con validación de Zod
  //? mode: "onChange" valida en tiempo real mientras el usuario escribe
  const { register, handleSubmit, formState, trigger, getValues } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  //* Errores de validación del formulario
  const { errors } = formState;

  //* ========================================
  //* HANDLER: Seleccionar imagen de perfil
  //* ========================================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  //* ========================================
  //* HANDLER: Siguiente paso
  //* ========================================
  const handleNext = async () => {
    let fieldsToValidate = [];

    if (currentStep === 1) {
      fieldsToValidate = ["username", "email", "password", "confirmpassword"];
    } else if (currentStep === 3) {
      fieldsToValidate = [
        "first_name",
        "last_name",
        "age",
        "dni",
        "phone",
        "address",
        "sex",
      ];
    }

    // Validar campos del paso actual
    const isValid = await trigger(fieldsToValidate);

    if (isValid || currentStep === 2) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  //* ========================================
  //* HANDLER: Paso anterior
  //* ========================================
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  //* ========================================
  //* HANDLER: Omitir foto de perfil
  //* ========================================
  const handleSkip = () => {
    setProfileImage(null);
    setImagePreview(null);
    setCurrentStep(3);
  };

  //* ========================================
  //* SUBMIT: Separar datos y enviar al servidor
  //* ========================================
  const onSubmit = async (data) => {
    //? Desestructurar: separar profile de credenciales
    const { first_name, last_name, age, dni, phone, address, sex, ...rest } =
      data;

    //* Profile: objeto con datos personales
    const profile = { first_name, last_name, age, dni, phone, address, sex };

    //* Preparar FormData para enviar datos + imagen
    const formData = new FormData();
    formData.append("username", rest.username);
    formData.append("email", rest.email);
    formData.append("password", rest.password);
    formData.append("role", role);
    formData.append("profile", JSON.stringify(profile));

    // Agregar imagen si existe
    if (profileImage) {
      formData.append("profile_picture", profileImage);
    }

    console.log(formData);
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "x-token": localStorage.getItem("token") || "",
        },
        body: formData,
      });

      const result = await response.json();
      if (result.ok) {
        navigate("/login");
      } else {
        console.error("Error en registro:", result.msg);
        alert(result.msg || "Error al registrar usuario");
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Error de conexión al registrar");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-xl mx-auto bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-10 flex flex-col gap-8 border-t-8 border-cyan-500"
    >
      <h1 className="text-4xl font-extrabold text-cyan-700 mb-4 text-center tracking-tight drop-shadow">
        {role === "Ciudadano"
          ? "Regístrate como Ciudadano"
          : role === "Operador"
          ? "Registro de Operador"
          : role === "Trabajador"
          ? "Registro de Trabajador"
          : "Registro"}
      </h1>

      {/* Indicador de pasos */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <div
          className={`flex items-center gap-2 ${
            currentStep >= 1 ? "text-cyan-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              currentStep >= 1
                ? "bg-cyan-600 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            1
          </div>
          <span className="text-sm font-semibold">Credenciales</span>
        </div>
        <div
          className={`w-12 h-1 ${
            currentStep >= 2 ? "bg-cyan-600" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`flex items-center gap-2 ${
            currentStep >= 2 ? "text-cyan-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              currentStep >= 2
                ? "bg-cyan-600 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            2
          </div>
          <span className="text-sm font-semibold">Foto</span>
        </div>
        <div
          className={`w-12 h-1 ${
            currentStep >= 3 ? "bg-cyan-600" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`flex items-center gap-2 ${
            currentStep >= 3 ? "text-cyan-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              currentStep >= 3
                ? "bg-cyan-600 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            3
          </div>
          <span className="text-sm font-semibold">Datos</span>
        </div>
      </div>

      {/* //? ======================================== */}
      {/* //? PASO 1: Credenciales */}
      {/* //? ======================================== */}
      {currentStep === 1 && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="block text-base font-semibold text-cyan-700 mb-1"
            >
              Usuario
            </label>
            <input
              type="text"
              {...register("username")}
              id="username"
              className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg"
            />
            {errors.username && (
              <span className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="block text-base font-semibold text-cyan-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              id="email"
              className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg"
            />
            {errors.email && (
              <span className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="block text-base font-semibold text-cyan-700 mb-1"
            >
              Contraseña
            </label>
            <input
              type="password"
              {...register("password")}
              id="password"
              className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg"
            />
            {errors.password && (
              <span className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirmpassword"
              className="block text-base font-semibold text-cyan-700 mb-1"
            >
              Confirmar contraseña
            </label>
            <input
              type="password"
              {...register("confirmpassword")}
              id="confirmpassword"
              className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg"
            />
            {errors.confirmpassword && (
              <span className="text-red-500 text-sm mt-1">
                {errors.confirmpassword.message}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="bg-cyan-600 text-white font-bold py-3 px-8 rounded-xl shadow hover:bg-cyan-700 transition text-lg mt-4"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* //? ======================================== */}
      {/* //? PASO 2: Foto de perfil */}
      {/* //? ======================================== */}
      {currentStep === 2 && (
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl font-bold text-cyan-600 text-center">
            Foto de perfil (Opcional)
          </h2>

          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-cyan-400 shadow-lg bg-cyan-100 cursor-pointer group">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-cyan-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-20 w-20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
              <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {imagePreview ? "Cambiar" : "Agregar"}
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          <div className="flex gap-4 w-full mt-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 bg-gray-400 text-white font-bold py-3 px-6 rounded-xl shadow hover:bg-gray-500 transition text-lg"
            >
              Atrás
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 bg-gray-600 text-white font-bold py-3 px-6 rounded-xl shadow hover:bg-gray-700 transition text-lg"
            >
              Omitir
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 bg-cyan-600 text-white font-bold py-3 px-6 rounded-xl shadow hover:bg-cyan-700 transition text-lg"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* //? ======================================== */}
      {/* //? PASO 3: Datos personales */}
      {/* //? ======================================== */}
      {currentStep === 3 && (
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-cyan-600 text-center">
            Datos personales
          </h2>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="firstname"
              className="block text-base font-semibold text-cyan-700 mb-1"
            >
              Nombre
            </label>
            <input
              type="text"
              {...register("first_name")}
              id="firstname"
              className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg"
            />
            {errors.first_name && (
              <span className="text-red-500 text-sm mt-1">
                {errors.first_name.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="lastname"
              className="block text-base font-semibold text-cyan-700 mb-1"
            >
              Apellido
            </label>
            <input
              type="text"
              {...register("last_name")}
              id="lastname"
              className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg"
            />
            {errors.last_name && (
              <span className="text-red-500 text-sm mt-1">
                {errors.last_name.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="age"
              className="block text-base font-semibold text-cyan-700 mb-1"
            >
              Edad
            </label>
            <input
              type="text"
              {...register("age")}
              id="age"
              className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg"
            />
            {errors.age && (
              <span className="text-red-500 text-sm mt-1">
                {errors.age.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="dni"
              className="block text-base font-semibold text-cyan-700 mb-1"
            >
              DNI
            </label>
            <input
              type="text"
              {...register("dni")}
              id="dni"
              className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg"
            />
            {errors.dni && (
              <span className="text-red-500 text-sm mt-1">
                {errors.dni.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="phone"
              className="block text-base font-semibold text-cyan-700 mb-1"
            >
              Teléfono
            </label>
            <input
              type="text"
              {...register("phone")}
              id="phone"
              className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg"
            />
            {errors.phone && (
              <span className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="address"
              className="block text-base font-semibold text-cyan-700 mb-1"
            >
              Dirección
            </label>
            <input
              type="text"
              {...register("address")}
              id="address"
              className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg"
            />
            {errors.address && (
              <span className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="sex"
              className="block text-base font-semibold text-cyan-700 mb-1"
            >
              Sexo
            </label>
            <select
              {...register("sex")}
              defaultValue=""
              className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg"
            >
              <option value="" disabled>
                Seleccione
              </option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Otro">Otro</option>
            </select>
            {errors.sex && (
              <span className="text-red-500 text-sm mt-1">
                {errors.sex.message}
              </span>
            )}
          </div>

          <div className="flex gap-4 w-full mt-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 bg-gray-400 text-white font-bold py-3 px-6 rounded-xl shadow hover:bg-gray-500 transition text-lg"
            >
              Atrás
            </button>
            <button
              type="submit"
              className="flex-1 bg-cyan-600 text-white font-bold py-3 px-6 rounded-xl shadow hover:bg-cyan-700 transition text-lg"
            >
              Registrar
            </button>
          </div>
        </div>
      )}

      {/* Link a login */}
      <p className="text-base text-center mt-4">
        ¿Ya tienes una cuenta?{" "}
        <Link
          to="/login"
          className="text-cyan-600 hover:underline font-semibold"
        >
          Inicia sesión
        </Link>
      </p>
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
