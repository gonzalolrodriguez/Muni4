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
    <section className="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-blue-50 to-blue-100">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">Iniciar sesión</h1>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
          <input type="text" {...register("username")} id="username" className="input input-bordered w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input type="password" {...register("password")} id="password" className="input input-bordered w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>
        {backendError && <div className="text-red-500 text-sm mb-2">{backendError}</div>}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2">
          <Link to="/forgotpassword" className="text-blue-600 hover:underline text-sm">¿Olvidaste tu contraseña?</Link>
          <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Iniciar sesión</button>
        </div>
        <div className="text-center text-sm mt-2">
          ¿No tienes una cuenta? <Link to="/register" className="text-blue-600 hover:underline">Regístrate</Link>
        </div>
      </form>
    </section>
  );
};

export default Login;
