//* ========================================
//* CUSTOM HOOK: useFetch
//* ========================================
//* Propósito: Centralizar TODAS las peticiones HTTP al backend
//* Incluye: GET, POST, PUT, PATCH, DELETE con manejo automático de JWT token
//* Uso: const { getFetchData, postFetch, ... } = useFetch();

const useFetch = () => {
  //! IMPORTANTE: URL base del backend - cambiar en producción
  // Cambia la URL base del backend para pruebas locales
  // En useFetch.js:
  const hostPort = "http://localhost:3000/api";
  // Si tu backend responde en /api, déjalo como estaba.

  //* ========================================
  //* FUNCIÓN: getFetchData
  //* ========================================
  //* Propósito: Obtener datos del backend con autenticación
  //* Método: GET
  //* Requiere: Token JWT en localStorage
  //* Parámetros:
  //*   - url (string): Ruta del endpoint (ej: "/reports", "/task/worker")
  //* Retorna: Objeto con datos del backend
  //* Ejemplo: const data = await getFetchData("/reports");

  const getFetchData = async (url) => {
    //? Obtener token del localStorage (guardado en login)
    const token = localStorage.getItem("token");

    //! Si no hay token, redirigir a login (usuario no autenticado)
    if (!token) {
      window.location.replace("/login");
      return;
    }

    try {
      //* Hacer petición GET al backend
      const response = await fetch(`${hostPort}${url}`, {
        headers: {
          authorization: `Bearer ${token}`, // Enviar token en header
        },
      });

      //* Convertir respuesta a JSON
      const data = await response.json();

      //! Si la respuesta no es exitosa (status 4xx o 5xx), lanzar error
      if (!response.ok) {
        throw new Error(data?.msg || "Error de red o respuesta no válida");
      }

      return data;
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      throw error; // Re-lanzar error para que el componente lo maneje
    }
  };

  //* ========================================
  //* FUNCIÓN: getByIdFetch
  //* ========================================
  //* Propósito: Obtener UN recurso específico por su ID
  //* Método: GET
  //* Requiere: Token JWT
  //* Parámetros:
  //*   - url (string): Ruta base (ej: "/report")
  //*   - id (string): ID del recurso a obtener
  //* Retorna: Objeto con el recurso específico
  //* Ejemplo: const report = await getByIdFetch("/report", "507f1f77bcf86cd799439011");

  const getByIdFetch = async (url, id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.replace("/login");
      return;
    }

    try {
      //* URL final: /api/report/507f1f77bcf86cd799439011
      const response = await fetch(`${hostPort}${url}/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.msg || "Error de red o respuesta no válida");
      }

      return data;
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      throw error;
    }
  };

  //* ========================================
  //* FUNCIÓN: postFetch
  //* ========================================
  //* Propósito: Enviar datos JSON al backend SIN autenticación
  //* Método: POST
  //* Requiere: NO requiere token (usado en login y register)
  //* Parámetros:
  //*   - url (string): Ruta del endpoint
  //*   - payload (object): Datos a enviar en formato objeto
  //* Retorna: Respuesta del backend
  //* Ejemplo: await postFetch("/auth/login", { username, password });
  //! IMPORTANTE: Solo usar en endpoints públicos (login, register)

  const postFetch = async (url, payload) => {
    try {
      const response = await fetch(`${hostPort}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Indicar que enviamos JSON
        },
        body: JSON.stringify(payload), // Convertir objeto a string JSON
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data?.msg || "Error de red o respuesta no válida");
      }

      return data;
    } catch (error) {
      console.error("Error al enviar datos:", error);
      throw error;
    }
  };

  //* ========================================
  //* FUNCIÓN: postFetchLocalStorage
  //* ========================================
  //* Propósito: Enviar datos JSON al backend CON autenticación
  //* Método: POST
  //* Requiere: Token JWT en localStorage
  //* Parámetros:
  //*   - url (string): Ruta del endpoint
  //*   - payload (object): Datos a enviar
  //* Retorna: Respuesta del backend
  //* Ejemplo: await postFetchLocalStorage("/task", { title, description });
  //* Diferencia con postFetch: Este incluye el token de autenticación

  const postFetchLocalStorage = async (url, payload) => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.replace("/login");
      return;
    }

    try {
      const response = await fetch(`${hostPort}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`, // Token incluido
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.msg || "Error de red o respuesta no válida");
      }

      return data;
    } catch (error) {
      console.error("Error al enviar datos:", error);
      throw error;
    }
  };

  //* ========================================
  //* FUNCIÓN: postFetchFormData
  //* ========================================
  //* Propósito: Enviar archivos/imágenes al backend CON autenticación
  //* Método: POST
  //* Requiere: Token JWT en localStorage
  //* Parámetros:
  //*   - url (string): Ruta del endpoint
  //*   - formData (FormData): Objeto FormData con archivos y campos
  //* Retorna: Respuesta del backend con rutas de imágenes guardadas
  //* Ejemplo: await postFetchFormData("/report", formData);
  //! CRÍTICO: NO incluir Content-Type header (el navegador lo configura automáticamente con boundary)
  //* Usado en: CitizenReports, WorkerProgress (subir imágenes)

  const postFetchFormData = async (url, formData) => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.replace("/login");
      return;
    }

    try {
      const response = await fetch(`${hostPort}${url}`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          //! NO incluir Content-Type - el navegador lo configura automáticamente con boundary
          //* El navegador agrega: Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
        },
        body: formData, // FormData directamente, NO JSON.stringify
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.msg || "Error de red o respuesta no válida");
      }

      return data;
    } catch (error) {
      console.error("Error al enviar datos:", error);
      throw error;
    }
  };

  //* ========================================
  //* FUNCIÓN: putFetch
  //* ========================================
  //* Propósito: Actualizar un recurso existente por su ID
  //* Método: PUT
  //* Requiere: Token JWT en localStorage
  //* Parámetros:
  //*   - url (string): Ruta base del recurso
  //*   - id (string): ID del recurso a actualizar
  //*   - payload (object): Datos a actualizar
  //* Retorna: Recurso actualizado
  //* Ejemplo: await putFetch("/report", reportId, { status: "Aceptado" });

  const putFetch = async (url, id, payload) => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.replace("/login");
      return;
    }

    try {
      //* URL final: /api/report/507f1f77bcf86cd799439011
      const response = await fetch(`${hostPort}${url}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.msg || "Error de red o respuesta no válida");
      }

      return data;
    } catch (error) {
      console.error("Error al actualizar datos:", error);
      throw error;
    }
  };

  //* ========================================
  //* FUNCIÓN: putFetchProfile
  //* ========================================
  //* Propósito: Actualizar perfil de usuario (sin ID en URL)
  //* Método: PUT
  //* Requiere: Token JWT (el backend obtiene el ID del token)
  //* Parámetros:
  //*   - url (string): Ruta completa (ej: "/user/profile")
  //*   - payload (object): Datos del perfil a actualizar
  //* Retorna: Perfil actualizado
  //* Ejemplo: await putFetchProfile("/user/profile", { first_name, last_name });
  //* Diferencia con putFetch: No requiere ID como parámetro separado

  const putFetchProfile = async (url, payload) => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.replace("/login");
      return;
    }

    try {
      const response = await fetch(`${hostPort}${url}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.msg || "Error de red o respuesta no válida");
      }

      return data;
    } catch (error) {
      console.error("Error al actualizar datos:", error);
      throw error;
    }
  };

  //* ========================================
  //* FUNCIÓN: patchFetch
  //* ========================================
  //* Propósito: Actualización parcial de un recurso (sin ID en URL)
  //* Método: PATCH
  //* Requiere: Token JWT en localStorage
  //* Parámetros:
  //*   - url (string): Ruta completa del endpoint
  //*   - payload (object): Campos a actualizar parcialmente
  //* Retorna: Recurso actualizado
  //* Ejemplo: await patchFetch("/user/status", { is_active: true });
  //* Diferencia con PUT: PATCH actualiza solo los campos enviados, PUT reemplaza todo

  const patchFetch = async (url, payload) => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.replace("/login");
      return;
    }

    try {
      const response = await fetch(`${hostPort}${url}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.msg || data?.message || "Error de red o respuesta no válida"
        );
      }

      return data;
    } catch (error) {
      console.error("Error al modificar datos:", error);
      throw error;
    }
  };

  //* ========================================
  //* FUNCIÓN: deleteFetch
  //* ========================================
  //* Propósito: Eliminar un recurso por su ID
  //* Método: DELETE
  //* Requiere: Token JWT en localStorage
  //* Parámetros:
  //*   - url (string): Ruta base del recurso
  //*   - id (string): ID del recurso a eliminar
  //* Retorna: Confirmación de eliminación
  //* Ejemplo: await deleteFetch("/report", reportId);
  //! IMPORTANTE: En el backend, esto hace soft delete (deleted_at = fecha actual)

  const deleteFetch = async (url, id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.replace("/login");
      return;
    }

    try {
      //* URL final: /api/report/507f1f77bcf86cd799439011
      const response = await fetch(`${hostPort}${url}/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.msg || "Error de red o respuesta no válida");
      }

      return data;
    } catch (error) {
      console.error("Error al eliminar datos:", error);
      throw error;
    }
  };

  //* ========================================
  //* RETURN: Funciones exportadas
  //* ========================================
  //* Todas las funciones disponibles para usar en componentes
  return {
    getFetchData, // GET con token
    postFetch, // POST sin token (login/register)
    postFetchLocalStorage, // POST con token (JSON)
    postFetchFormData, // POST con token (archivos/FormData)
    putFetch, // PUT con token y ID
    putFetchProfile, // PUT con token sin ID separado
    patchFetch, // PATCH con token
    deleteFetch, // DELETE con token y ID
    getByIdFetch, // GET con token y ID específico
  };
};

export default useFetch;

//* ========================================
//* TRADUCCIÓN DE CONSTANTES
//* ========================================
//* hostPort = Puerto del host (URL del backend)
//* token = Token JWT de autenticación
//* url = Dirección URL del endpoint
//* id = Identificador único del recurso
//* payload = Carga de datos a enviar
//* formData = Datos de formulario (para archivos)
//* response = Respuesta del servidor
//* data = Datos recibidos del backend
//* error = Error capturado en try-catch
