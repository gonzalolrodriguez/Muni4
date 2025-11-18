//* ========================================
//* PÁGINA: CitizenReports
//* ========================================
//* Propósito: Formulario para que ciudadanos creen nuevos reportes
//* Características:
//*   - Formulario con validación mediante React Hook Form + Zod
//*   - Subida de hasta 5 imágenes (15MB c/u) con preview
//*   - Selección de ubicación en mapa interactivo
//*   - Campo dinámico "Otro" para tipos de reporte personalizados
//*   - Envío de datos como FormData (requerido para imágenes)
//* Campos:
//*   - title: Título del reporte
//*   - description: Descripción detallada
//*   - type_report: Tipo (Bache, Alumbrado, Basura, Incidente, Otro)
//*   - other_type_detail: Especificación cuando type_report es "Otro"
//*   - location: { lat, lng } desde el mapa
//*   - images: Array de archivos (opcional)

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CitizenLeafletMap from "../../components/LeafletMaps/CitizenLeafletMap";
import ImageUploader from "../../components/ImageUploader";
import reportSchema from "../../schemas/ReportSchema.js";
import { useState } from "react";
import useFetch from "../../hooks/useFetch.js";

const CitizenReports = () => {
  //* Hook personalizado para hacer peticiones HTTP
  const { postFetchFormData } = useFetch();

  //* ========================================
  //* REACT HOOK FORM: Configuración
  //* ========================================
  //* register: Registrar inputs en el formulario
  //* handleSubmit: Manejar el envío del formulario
  //* formState: Estado del formulario (errors, isValid, etc.)
  //* watch: Observar valores de campos específicos
  //* reset: Resetear el formulario a valores iniciales
  //* zodResolver: Validador usando Zod schema
  const { register, handleSubmit, formState, watch, reset } = useForm({
    resolver: zodResolver(reportSchema),
  });

  const { errors } = formState; // Extraer errores de validación

  //* ========================================
  //* ESTADOS LOCALES
  //* ========================================
  //* markerPosition: [lat, lng] de la ubicación seleccionada en el mapa
  const [markerPosition, setMarkerPosition] = useState(null);

  //* selectedImages: Array de archivos de imagen seleccionados
  const [selectedImages, setSelectedImages] = useState([]);
  // Estado para resetear el ImageUploader
  const [resetImages, setResetImages] = useState(false);

  //* ========================================
  //* FUNCIÓN: handleMarkerChange
  //* ========================================
  //* Propósito: Callback para recibir la posición del marcador del mapa
  //* Parámetro: position - [lat, lng]
  //* Se ejecuta cuando el usuario hace click en el mapa (CitizenLeafletMap)
  const handleMarkerChange = (position) => {
    setMarkerPosition(position);
  };

  //* ========================================
  //* FUNCIÓN: handleImagesChange
  //* ========================================
  //* Propósito: Callback para recibir las imágenes del ImageUploader
  //* Parámetro: files - Array de File objects
  //* Se ejecuta cuando el usuario selecciona imágenes válidas
  const handleImagesChange = (files) => {
    setSelectedImages(files);
    // Si el usuario selecciona imágenes, desactiva el reset
    if (resetImages) setResetImages(false);
  };

  //* ========================================
  //* FUNCIÓN: onSubmit
  //* ========================================
  //* Propósito: Procesar y enviar el formulario al backend
  //* Se ejecuta cuando el formulario pasa todas las validaciones de Zod
  //* @param {Object} data - Datos validados del formulario
  const onSubmit = (data) => {
    //! VALIDACIÓN: Verificar que se haya seleccionado ubicación
    if (!markerPosition) {
      alert("Por favor, selecciona una ubicación en el mapa");
      return;
    }

    //* Desestructurar coordenadas del marcador
    const [lat, lng] = markerPosition;

    //* ========================================
    //* CONSTRUIR FORMDATA
    //* ========================================
    //! IMPORTANTE: Usar FormData para enviar archivos (imágenes)
    //* No se puede enviar archivos con JSON, debe ser FormData
    const formData = new FormData();

    //* Agregar campos de texto
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("type_report", data.type_report);

    //? Agregar campo opcional "other_type_detail" solo si existe
    if (data.other_type_detail) {
      formData.append("other_type_detail", data.other_type_detail);
    }

    //* Agregar ubicación (lat y lng por separado)
    //* Backend espera location[lat] y location[lng]
    formData.append("location[lat]", lat);
    formData.append("location[lng]", lng);

    //* ========================================
    //* AGREGAR IMÁGENES AL FORMDATA
    //* ========================================
    //! IMPORTANTE: Cada imagen se agrega con el mismo nombre "images"
    //* Multer en el backend procesará esto como un array
    selectedImages.forEach((file) => {
      formData.append("images", file);
    });

    //* Enviar FormData al backend
    postFetchFormData("/report", formData);

    //* Resetear formulario y estados después del envío
    reset(); // Limpiar campos del formulario
    setSelectedImages([]); // Limpiar imágenes seleccionadas
    setResetImages(true); // Indicar al ImageUploader que limpie
    // Hacer scroll al tope de la página
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  //* ========================================
  //* RENDERIZADO: Formulario de reporte
  //* ========================================
  return (
    <div className="min-h-screen bg-[#eaf4fe] py-8 px-2 flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl mx-auto bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-10 flex flex-col gap-8 border border-cyan-200"
      >
        <h1 className="text-3xl font-extrabold text-cyan-700 mb-2 text-center tracking-tight drop-shadow">
          Haz un Reporte
        </h1>

        {/* CAMPO 1: Título del reporte */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-cyan-700 mb-1"
          >
            Título
          </label>
          <input
            type="text"
            {...register("title")}
            id="title"
            className="w-full px-4 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* CAMPO 2: Descripción del reporte */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-cyan-700 mb-1"
          >
            Descripción
          </label>
          <input
            type="text"
            {...register("description")}
            id="description"
            className="w-full px-4 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* CAMPO 3: Tipo de reporte */}
        <div>
          <label
            htmlFor="type_report"
            className="block text-sm font-semibold text-cyan-700 mb-1"
          >
            Tipo de reporte
          </label>
          <select
            id="type_report"
            {...register("type_report")}
            className="w-full px-4 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg"
          >
            <option value="">Seleccione</option>
            <option value="Bache">Bache</option>
            <option value="Alumbrado">Alumbrado</option>
            <option value="Basura">Basura</option>
            <option value="Otro">Otro</option>
          </select>
          {errors.type_report && (
            <p className="text-red-500 text-sm mt-1">
              {errors.type_report.message}
            </p>
          )}
          {watch("type_report") === "Otro" && (
            <div>
              <label
                htmlFor="other_type_detail"
                className="block text-sm font-semibold text-cyan-700 mb-1"
              >
                Especifique
              </label>
              <input
                type="text"
                {...register("other_type_detail")}
                className="w-full px-4 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50 text-lg"
              />
              {errors.other_type_detail && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.other_type_detail.message}
                </p>
              )}
            </div>
          )}
        </div>

        {/* CAMPO 4: Subir imágenes (opcional) */}
        <div>
          <label className=" text-sm font-semibold text-cyan-700 mb-1">
            Imágenes (opcional, máx. 5)
          </label>
          <ImageUploader
            onFilesChange={handleImagesChange}
            maxFiles={5}
            maxSizeMB={15}
            resetImages={resetImages}
          />
        </div>

        {/* CAMPO 5: Selección de ubicación en mapa */}
        <div>
          <CitizenLeafletMap onMarkerChange={handleMarkerChange} />
          {markerPosition && (
            <div className="mt-2 text-xs text-cyan-700 text-center font-semibold">
              Coordenadas seleccionadas: {markerPosition.join(", ")}
            </div>
          )}
        </div>

        {/* BOTÓN: Enviar formulario */}
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className="bg-cyan-600 text-white font-bold py-3 px-8 rounded-xl shadow hover:bg-cyan-700 transition text-lg"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CitizenReports;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * register = registrar
 * handleSubmit = manejar envío
 * formState = estado del formulario
 * watch = observar
 * reset = resetear
 * errors = errores
 * markerPosition = posición del marcador
 * setMarkerPosition = establecer posición del marcador
 * selectedImages = imágenes seleccionadas
 * setSelectedImages = establecer imágenes seleccionadas
 * handleMarkerChange = manejar cambio de marcador
 * position = posición
 * handleImagesChange = manejar cambio de imágenes
 * files = archivos
 * onSubmit = al enviar
 * data = datos
 * lat = latitud
 * lng = longitud
 * formData = datos del formulario
 * postFetchFormData = enviar datos con archivos
 * title = título
 * description = descripción
 * type_report = tipo de reporte
 * other_type_detail = detalle de otro tipo
 */
