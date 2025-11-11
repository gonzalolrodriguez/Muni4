//* ========================================
//* PÁGINA: WorkerProgress
//* ========================================
//* Propósito: Formulario para trabajadores registren avances de tareas
//* Características:
//*   - Solo puede reportar progreso de tarea actualmente "En Progreso"
//*   - Subida de imágenes (hasta 5, 15MB c/u)
//*   - Selección de ubicación en mapa
//*   - Estados: En Progreso, Finalizado
//*   - Al marcar "Finalizado": completa automáticamente TODOS los reportes asociados
//*   - Validación de ubicación obligatoria
//* Campos:
//*   - title: Título del avance
//*   - description: Descripción del trabajo realizado
//*   - status: Estado (En Progreso / Finalizado)
//*   - location: { lat, lng }
//*   - images: Array de archivos (opcional)
//*   - task: ID de la tarea (automático)
//*   - crew: ID de la cuadrilla (automático)

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useFetch from "../../hooks/useFetch";
import ImageUploader from "../../components/ImageUploader";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MapClickHandler from "../../components/LeafletMaps/MapClick";
import "leaflet/dist/leaflet.css";

const WorkerProgress = () => {
  const { getFetchData, postFetchFormData } = useFetch();

  //* Estados locales
  const [currentTask, setCurrentTask] = useState(null); // Tarea actual "En Progreso"
  const [markerPosition, setMarkerPosition] = useState(null); // [lat, lng]
  const [crew, setCrew] = useState(null); // Cuadrilla del trabajador
  const [selectedImages, setSelectedImages] = useState([]); // Imágenes seleccionadas

  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;

  //* ========================================
  //* USEEFFECT: Cargar tarea actual al montar componente
  //* ========================================
  //* Busca la tarea que está "En Progreso" del trabajador
  useEffect(() => {
    let isMounted = true;

    const fetchCurrentTask = async () => {
      try {
        //* GET /task/worker retorna { tasks: [], crew: {} }
        const data = await getFetchData("/task/worker");
        if (isMounted) {
          //? Buscar la primera tarea con status "En Progreso"
          const taskInProgress = data.tasks.find(
            (t) => t.status === "En Progreso"
          );
          setCurrentTask(taskInProgress || null);
          setCrew(data.crew);
        }
      } catch (error) {
        if (isMounted) {
          console.error(error);
          setCurrentTask(null);
        }
      }
    };

    fetchCurrentTask();

    //* Cleanup: Prevenir actualizaciones de estado en componente desmontado
    return () => {
      isMounted = false;
    };
  }, []);

  //* Callback para recibir imágenes del ImageUploader
  const handleImagesChange = (files) => {
    setSelectedImages(files);
  };

  //* ========================================
  //* FUNCIÓN: onSubmit
  //* ========================================
  //* Propósito: Enviar reporte de progreso al backend
  const onSubmit = async (data) => {
    //! VALIDACIÓN: Verificar ubicación
    if (!markerPosition) {
      alert("Por favor, marca tu ubicación en el mapa");
      return;
    }

    //! CONFIRMACIÓN ESPECIAL: Si se marca como "Finalizado"
    //* Esto es crítico porque completa TODOS los reportes de la tarea
    if (data.status === "Finalizado") {
      const confirmacion = window.confirm(
        "¿Estás seguro de marcar esta tarea como FINALIZADA? Esto completará automáticamente todos los reportes asociados."
      );
      if (!confirmacion) {
        return; // Usuario canceló
      }
    }

    const [lat, lng] = markerPosition;

    //* ========================================
    //* CONSTRUIR FORMDATA
    //* ========================================
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("status", data.status);
    formData.append("task", currentTask._id); // ID de la tarea
    formData.append("crew", crew._id); // ID de la cuadrilla
    formData.append("location[lat]", lat);
    formData.append("location[lng]", lng);

    //* Agregar imágenes
    selectedImages.forEach((file) => {
      formData.append("images", file);
    });

    try {
      //* Enviar reporte de progreso
      await postFetchFormData("/progress-report", formData);

      //* Resetear formulario y estados
      reset();
      setMarkerPosition(null);
      setSelectedImages([]);

      //? Mensajes y redirección según el estado
      if (data.status === "Finalizado") {
        alert(
          "✅ Tarea finalizada exitosamente. Todos los reportes asociados han sido completados."
        );
        //* Redirigir a /worker/tasks después de 2 segundos
        setTimeout(() => {
          window.location.href = "/worker/tasks";
        }, 2000);
      } else {
        alert("Avance registrado exitosamente");
      }
    } catch (error) {
      console.error("Error al registrar avance:", error);
      alert("Error al registrar el avance");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-4xl mx-auto w-full py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Registro de Avances
      </h1>

      {!currentTask ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-gray-600 text-lg mb-4">
            No tienes ninguna tarea en progreso
          </p>
          <button
            onClick={() => (window.location.href = "/worker/tasks")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Acepta una tarea
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
            <h2 className="text-lg font-semibold text-indigo-700 mb-2">
              Tarea actual: {currentTask.title}
            </h2>
            <p className="text-gray-600">{currentTask.description}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Título del avance
              </label>
              <input
                type="text"
                id="title"
                {...register("title", { required: "El título es obligatorio" })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ej: Reparación de bache en progreso"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descripción
              </label>
              <textarea
                id="description"
                {...register("description", {
                  required: "La descripción es obligatoria",
                })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows="4"
                placeholder="Describe el avance realizado..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Estado del avance
              </label>
              <select
                id="status"
                {...register("status", {
                  required: "El estado es obligatorio",
                })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Selecciona un estado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Finalizado">Finalizado</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>

            <div>
              <ImageUploader
                onFilesChange={handleImagesChange}
                maxFiles={5}
                maxSizeMB={15}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación actual
              </label>
              <div className="w-full h-96 border rounded-lg overflow-hidden">
                //* Mapa Leaflet: Centrado en Formosa capital
                <MapContainer
                  center={[-26.1849, -58.1756]} // Coordenadas de Formosa
                  zoom={15}
                  scrollWheelZoom={true}
                  className="w-full h-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {/* MapClickHandler: Captura clicks en el mapa */}
                  <MapClickHandler onClickPosition={setMarkerPosition} />
                  {/* Mostrar marcador si hay posición seleccionada */}
                  {markerPosition && (
                    <Marker position={markerPosition}>
                      <Popup>Ubicación seleccionada</Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
              {/* Mostrar coordenadas seleccionadas */}
              {markerPosition && (
                <p className="text-sm text-gray-600 mt-2">
                  Coordenadas: {markerPosition[0].toFixed(4)},{" "}
                  {markerPosition[1].toFixed(4)}
                </p>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setMarkerPosition(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Registrar avance
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default WorkerProgress;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * currentTask = tarea actual
 * setCurrentTask = establecer tarea actual
 * markerPosition = posición del marcador
 * setMarkerPosition = establecer posición del marcador
 * crew = cuadrilla
 * setCrew = establecer cuadrilla
 * selectedImages = imágenes seleccionadas
 * setSelectedImages = establecer imágenes seleccionadas
 * register = registrar
 * handleSubmit = manejar envío
 * reset = resetear
 * formState = estado del formulario
 * errors = errores
 * getFetchData = obtener datos
 * postFetchFormData = enviar datos con archivos
 * isMounted = está montado
 * fetchCurrentTask = obtener tarea actual
 * tasks = tareas
 * taskInProgress = tarea en progreso
 * status = estado
 * handleImagesChange = manejar cambio de imágenes
 * files = archivos
 * onSubmit = al enviar
 * data = datos
 * confirmacion = confirmación
 * lat = latitud
 * lng = longitud
 * formData = datos del formulario
 * title = título
 * description = descripción
 * task = tarea
 * location = ubicación
 * images = imágenes
 */
