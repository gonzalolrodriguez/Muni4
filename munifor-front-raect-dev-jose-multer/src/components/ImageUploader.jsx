//* ========================================
//* COMPONENTE: ImageUploader
//* ========================================
//* Propósito: Componente reutilizable para subir múltiples imágenes
//* Características:
//*   - Preview de imágenes antes de subir
//*   - Validación de formato (jpg, png, gif, webp)
//*   - Validación de tamaño (configurable, default 15MB)
//*   - Validación de cantidad (configurable, default 5 imágenes)
//*   - Eliminación individual de imágenes
//*   - UI responsive con Tailwind
//* Props:
//*   - onFilesChange: Callback que recibe array de archivos válidos
//*   - maxFiles: Máximo de archivos permitidos (default: 5)
//*   - maxSizeMB: Tamaño máximo por archivo en MB (default: 15)

import { useState } from "react";

const ImageUploader = ({ onFilesChange, maxFiles = 5, maxSizeMB = 15 }) => {
  //? Estado para guardar las previsualizaciones de imágenes
  //* Cada preview tiene: { file, url, name }
  const [previews, setPreviews] = useState([]);

  //? Estado para guardar errores de validación
  //* Array de strings con mensajes de error
  const [errors, setErrors] = useState([]);

  //* ========================================
  //* CONFIGURACIÓN: Formatos y tamaños permitidos
  //* ========================================
  //! Solo estos formatos están permitidos
  const allowedFormats = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  //* Convertir MB a bytes para la validación
  //* Ejemplo: 15MB = 15 * 1024 * 1024 = 15,728,640 bytes
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  //* ========================================
  //* FUNCIÓN: handleFileChange
  //* ========================================
  //* Propósito: Manejar la selección de archivos
  //* Se ejecuta cuando el usuario selecciona archivos en el input
  //* Validaciones:
  //*   1. Cantidad máxima de archivos
  //*   2. Formato de cada archivo
  //*   3. Tamaño de cada archivo
  const handleFileChange = (e) => {
    //? Convertir FileList a Array para poder usar forEach
    const files = Array.from(e.target.files);

    //* Arrays para almacenar archivos válidos y errores
    const validFiles = [];
    const newErrors = [];

    //* ========================================
    //* VALIDACIÓN 1: Cantidad de archivos
    //* ========================================
    if (files.length > maxFiles) {
      newErrors.push(`Máximo ${maxFiles} imágenes permitidas`);
      setErrors(newErrors);
      return; // Detener si excede la cantidad
    }

    //* ========================================
    //* VALIDACIÓN 2 y 3: Formato y tamaño de cada archivo
    //* ========================================
    files.forEach((file, index) => {
      //? VALIDACIÓN 2: Verificar formato
      if (!allowedFormats.includes(file.type)) {
        newErrors.push(
          `${file.name}: formato no permitido (solo jpg, png, gif, webp)`
        );
        return; // Saltar este archivo, continuar con el siguiente
      }

      //? VALIDACIÓN 3: Verificar tamaño
      if (file.size > maxSizeBytes) {
        newErrors.push(
          `${file.name}: tamaño excede ${maxSizeMB}MB (${(
            file.size /
            1024 /
            1024
          ).toFixed(2)}MB)`
        );
        return; // Saltar este archivo
      }

      //! Archivo válido, agregarlo al array
      validFiles.push(file);
    });

    //* Actualizar errores en el estado
    setErrors(newErrors);

    //* ========================================
    //* CREAR PREVISUALIZACIONES
    //* ========================================
    if (validFiles.length > 0) {
      //* Crear URLs temporales para mostrar las imágenes
      //* URL.createObjectURL() crea una URL blob temporal
      const newPreviews = validFiles.map((file) => ({
        file, // Archivo original
        url: URL.createObjectURL(file), // URL temporal para preview
        name: file.name, // Nombre del archivo
      }));

      setPreviews(newPreviews);

      //! Callback al componente padre con los archivos válidos
      //* El componente padre (CitizenReports, WorkerProgress) recibe estos archivos
      onFilesChange(validFiles);
    }
  };

  //* ========================================
  //* FUNCIÓN: handleRemoveImage
  //* ========================================
  //* Propósito: Eliminar una imagen específica del preview
  //* Parámetro: index del preview a eliminar
  const handleRemoveImage = (index) => {
    //? Filtrar el preview eliminando el índice seleccionado
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);

    //? Extraer los archivos de los previews restantes
    const newFiles = newPreviews.map((p) => p.file);
    onFilesChange(newFiles); // Actualizar el componente padre

    //! IMPORTANTE: Liberar memoria revocando la URL temporal
    //* Si no se hace, las URLs blob quedan en memoria
    URL.revokeObjectURL(previews[index].url);
  };

  //* ========================================
  //* FUNCIÓN: handleClearAll
  //* ========================================
  //* Propósito: Eliminar TODAS las imágenes del preview
  const handleClearAll = () => {
    //! Revocar todas las URLs temporales para liberar memoria
    previews.forEach((p) => URL.revokeObjectURL(p.url));

    //* Limpiar estados
    setPreviews([]);
    setErrors([]);
    onFilesChange([]); // Notificar al padre que no hay archivos
  };

  //* ========================================
  //* RENDERIZADO: Interfaz del componente
  //* ========================================
  return (
    <div className="space-y-4">
      {/* SECCIÓN 1: Input de archivos
       * Input HTML5 con atributo multiple para seleccionar varios archivos
       * accept especifica exactamente los formatos permitidos
       */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imágenes (opcional - máx. {maxFiles})
        </label>

        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" // Formatos permitidos
          multiple // Permite seleccionar múltiples archivos
          onChange={handleFileChange} // Ejecuta validación cuando cambia
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            cursor-pointer"
        />

        {/* Texto informativo sobre restricciones */}
        <p className="mt-1 text-xs text-gray-500">
          Formatos: JPG, PNG, GIF, WEBP. Máximo {maxSizeMB}MB por imagen.
        </p>
      </div>

      {/* SECCIÓN 2: Mostrar errores de validación
       * Solo se renderiza si hay errores (errors.length > 0)
       * Muestra una lista de todos los errores de validación
       */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm font-semibold text-red-800 mb-1">Errores:</p>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-red-700">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* SECCIÓN 3: Preview de imágenes seleccionadas
       * Solo se renderiza si hay previews (previews.length > 0)
       * Grid responsive: 2 cols móvil, 3 cols tablet, 5 cols desktop
       * Cada imagen tiene botón de eliminar individual (visible al hover)
       */}
      {previews.length > 0 && (
        <div className="space-y-2">
          {/* Header con contador y botón para eliminar todas */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              Imágenes seleccionadas ({previews.length})
            </p>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-red-600 hover:text-red-800 font-medium"
            >
              Eliminar todas
            </button>
          </div>

          {/* Grid de previsualizaciones */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                {/* Imagen con URL temporal generada por createObjectURL */}
                <img
                  src={preview.url} // URL blob temporal
                  alt={preview.name}
                  className="w-full h-24 object-cover rounded-md border border-gray-200"
                />

                {/* Botón eliminar individual (visible al hover con group-hover) */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200
                    hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Eliminar imagen"
                >
                  × {/* Símbolo X para eliminar */}
                </button>

                {/* Nombre del archivo truncado con tooltip */}
                <p
                  className="text-xs text-gray-600 mt-1 truncate"
                  title={preview.name} // Tooltip muestra nombre completo
                >
                  {preview.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * previews = vistas previas
 * setPreviews = establecer vistas previas
 * errors = errores
 * setErrors = establecer errores
 * allowedFormats = formatos permitidos
 * maxSizeBytes = tamaño máximo en bytes
 * handleFileChange = manejar cambio de archivo
 * files = archivos
 * validFiles = archivos válidos
 * newErrors = nuevos errores
 * file = archivo
 * url = dirección URL
 * name = nombre
 * handleRemoveImage = manejar eliminar imagen
 * index = índice
 * newPreviews = nuevas vistas previas
 * newFiles = nuevos archivos
 * handleClearAll = manejar limpiar todo
 * onFilesChange = al cambiar archivos (callback)
 * maxFiles = máximo de archivos
 * maxSizeMB = tamaño máximo en megabytes
 */
