//* ========================================
//* PÁGINA: Login
//* ========================================
//* Propósito: Formulario de inicio de sesión para todos los roles
//* Características:
//*   - Validación con Zod (loginSchema)
//*   - React Hook Form para manejo de formulario
//*   - Autenticación con JWT
//*   - Redirección automática según rol del usuario
//* Flujo:
//*   1. Usuario ingresa username y password
//*   2. Se valida con Zod schema
//*   3. POST a /auth/login
//*   4. Si es exitoso: guarda token, decodifica JWT, actualiza contexto
//*   5. Redirige según rol: Admin, Operador, Trabajador, o Ciudadano
//* Roles y rutas:
//*   - Administrador → /admin/dashboard
//*   - Operador → /operator/dashboard
//*   - Trabajador → /worker/dashboard
//*   - Ciudadano → /citizen/dashboard

import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import loginSchema from "../../schemas/LoginSchema.js";
import useFetch from "../../hooks/useFetch.js";
import { useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../../context/UserContext";

const Login = () => {
  const navigator = useNavigate(); // Hook para redireccionar
  const { postFetch } = useFetch(); // Hook para peticiones HTTP
  const [backendError, setBackendError] = useState(""); // Errores del backend
  const { setUser } = useContext(UserContext); // Actualizar usuario en contexto global

  //* ========================================
  //* REACT HOOK FORM: Configuración
  //* ========================================
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(loginSchema), // Validación con Zod
    mode: "onChange", // Validar al cambiar cada campo
  });

  const { errors } = formState; // Extraer errores de validación

  // Add missing onSubmit handler for login form
  const onSubmit = async (data) => {
    setBackendError("");
    try {
      const response = await postFetch("/auth/login", data);
      if (response?.token) {
        localStorage.setItem("token", response.token);
        const decoded = jwtDecode(response.token);
        setUser({ ...decoded, token: response.token });
        // Redirige según rol
        switch (decoded.role) {
          case "admin":
            navigator("/admin/dashboard");
            break;
          case "operator":
            navigator("/operator/dashboard");
            break;
          case "worker":
            navigator("/worker/dashboard");
            break;
          default:
            navigator("/citizen/dashboard");
        }
      } else {
        setBackendError(response?.message || "Credenciales incorrectas");
      }
    } catch (err) {
      setBackendError("Error de conexión");
    }
  };

  //* ========================================
  return (
    <section className="flex items-center justify-center min-h-screen bg-[#eaf4fe] px-2">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-10 flex flex-col gap-8 border border-cyan-300 border-t-4 border-cyan-500">
        <h1 className="text-4xl font-extrabold text-cyan-700 mb-4 text-center tracking-tight drop-shadow">Iniciar sesión</h1>
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="block text-base font-semibold text-cyan-700 mb-1">Usuario</label>
          <input type="text" {...register("username")} id="username" className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg" />
          {errors.username && <span className="text-red-500 text-sm mt-1">{errors.username.message}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="block text-base font-semibold text-cyan-700 mb-1">Contraseña</label>
          <input type="password" {...register("password")} id="password" className="w-full px-5 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg" />
          {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
        </div>
        {backendError && <div className="text-red-500 text-base font-semibold mb-2 text-center">{backendError}</div>}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 mt-2">
          <Link to="/forgotpassword" className="text-cyan-600 hover:underline text-base font-medium">¿Olvidaste tu contraseña?</Link>
          <button type="submit" className="bg-cyan-600 text-white font-bold py-3 px-8 rounded-xl shadow hover:bg-cyan-700 transition text-lg">Iniciar sesión</button>
        </div>
        <div className="text-center text-base mt-4">
          ¿No tienes una cuenta? <Link to="/register" className="text-cyan-600 hover:underline font-semibold">Regístrate</Link>
        </div>
      </form>
    </section>
  );
};

export default Login;
