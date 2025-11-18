//* ========================================
//* CONTEXTO GLOBAL: UserContext
//* ========================================
//* Propósito: Mantener el estado del usuario autenticado en TODA la aplicación
//* Incluye: _id y role del usuario actual
//* Uso: const { user, setUser } = useContext(UserContext);
//! IMPORTANTE: Este contexto se mantiene incluso al refrescar la página

import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

//* Crear el contexto (almacén global del usuario)
//* Valor por defecto: null (usuario no autenticado)
export const UserContext = createContext(null);

//* ========================================
//* COMPONENTE: UserProvider
//* ========================================
//* Propósito: Envolver toda la app para proveer el contexto de usuario
//* Props:
//*   - children: Componentes hijos que tendrán acceso al contexto
//* Estado:
//*   - user: { _id: string, role: string } o null si no está autenticado

export const UserProvider = ({ children }) => {
  //? Estado que guarda la información del usuario autenticado
  const [user, setUser] = useState(null);

  //* ========================================
  //* EFECTO: Verificar token al cargar la app
  //* ========================================
  //* Se ejecuta UNA sola vez cuando se monta el componente
  //* Verifica si hay un token guardado en localStorage
  //* Si existe y es válido, decodifica y actualiza el estado del usuario
  useEffect(() => {
    //? Intentar obtener el token del localStorage
    //* El token se guardó en Login.jsx después del login exitoso
    const token = localStorage.getItem("token");

    if (token) {
      try {
        //* Decodificar el token JWT para obtener los datos del usuario
        //* El token contiene: { _id, role, iat (fecha de emisión), exp (expiración) }
        const decoded = jwtDecode(token);

        console.log(`Decoded token:`, decoded);

        //! Actualizar el estado con los datos del usuario
        //* Solo guardamos _id, role y picture (lo esencial)
        setUser({
          _id: decoded._id,
          role: decoded.role,
          profile_picture: decoded.profile_picture,
        });
      } catch (err) {
        //! Si el token es inválido o está corrupto
        //* Limpiar localStorage y dejar user en null
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      //? No hay token, usuario no autenticado
      setUser(null);
    }
  }, []); // Array vacío = ejecutar solo una vez al montar

  //* ========================================
  //* PROVIDER: Proveer el contexto a los hijos
  //* ========================================
  //* Cualquier componente hijo puede acceder a user y setUser
  //* Ejemplo de uso en componente:
  //*   const { user, setUser } = useContext(UserContext);
  //*   console.log(user); // { _id: "507f...", role: "Ciudadano" }
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

//* ========================================
//* TRADUCCIÓN DE CONSTANTES
//* ========================================
//* user = Usuario autenticado actual
//* setUser = Función para actualizar el estado del usuario
//* children = Componentes hijos (toda la app)
//* token = Token JWT guardado en localStorage
//* decoded = Token decodificado con datos del usuario
//* _id = Identificador único del usuario en MongoDB
//* role = Rol del usuario (Ciudadano, Trabajador, Operador, Administrador)
