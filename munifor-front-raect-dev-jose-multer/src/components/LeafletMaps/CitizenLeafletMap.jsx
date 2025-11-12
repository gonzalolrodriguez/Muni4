//* ========================================
//* COMPONENTE: CitizenLeafletMap
//* ========================================
//* Propósito: Mapa interactivo con geolocalización para que ciudadanos seleccionen ubicación
//* Usado en: CitizenReports.jsx, WorkerProgress.jsx (seleccionar ubicación del reporte/avance)
//* Props:
//*   - onMarkerChange: función - Callback que recibe [lat, lng] cuando cambia la posición
//* Funcionalidad:
//*   - Obtiene ubicación actual del usuario con navigator.geolocation
//*   - Si falla, usa ubicación por defecto: Formosa, Argentina [-26.18489, -58.17214]
//*   - Permite cambiar ubicación haciendo click en el mapa (MapClickHandler)
//*   - Notifica al padre cada vez que cambia la posición

import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapClickHandler from "./MapClick";

const CitizenLeafletMap = ({ onMarkerChange }) => {
  const [position, setPosition] = useState(null);

  //* ========================================
  //* EFFECT: Obtener ubicación actual del usuario al montar
  //* ========================================
  useEffect(() => {
    //? Verificar si el navegador soporta geolocalización
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        //! Success: Usar ubicación actual
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        //! Error: Usar ubicación por defecto (Formosa)
        (error) => {
          console.error("Error al obtener ubicación:", error);
          setPosition([-26.18489, -58.17214]);
        }
      );
    } else {
      //! Geolocalización no soportada: Usar ubicación por defecto
      console.error("La geolocalización no es compatible con este navegador.");
      setPosition([-26.18489, -58.17214]);
    }
  }, []);

  //* ========================================
  //* CALLBACK: Actualizar posición cuando se hace click en el mapa
  //* ========================================
  const positionUpdate = (newPosition) => {
    setPosition(newPosition || null);
  };

  //* ========================================
  //* EFFECT: Notificar al padre cuando cambia la posición
  //* ========================================
  useEffect(() => {
    if (onMarkerChange && position) {
      //! Pasar nueva posición al componente padre
      onMarkerChange(position);
    }
  }, [position, onMarkerChange]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center border border-blue-100">
        <h2 className="text-2xl font-extrabold text-blue-700 mb-4 text-center tracking-tight">
          Selecciona la ubicación en el mapa
        </h2>
        <div className="w-full h-96 rounded-xl overflow-hidden mt-2 border-2 border-blue-400 shadow">
          {position ? (
            <MapContainer
              center={position}
              zoom={16}
              scrollWheelZoom={true}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>
                  <span className="font-semibold text-blue-700">
                    📍 {position[0].toFixed(5)}, {position[1].toFixed(5)}
                  </span>
                  <br />
                  <span className="text-gray-600">Ubicación seleccionada</span>
                </Popup>
              </Marker>
              <MapClickHandler onClickPosition={positionUpdate} />
            </MapContainer>
          ) : (
            <div className="flex items-center justify-center h-96">
              <p className="text-center text-gray-400 animate-pulse">
                Obteniendo ubicación...
              </p>
            </div>
          )}
        </div>
        <div className="mt-6 text-sm text-blue-700 text-center bg-blue-50 rounded-lg p-3 shadow-inner w-full">
          <span className="font-medium text-blue-600">Tip:</span> Puedes mover el
          marcador haciendo click en el mapa.
          <br />
          Si la geolocalización falla, se usará Formosa, Argentina por defecto.
          <br />
          <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
            Precisión:{" "}
            {position
              ? `${position[0].toFixed(5)}, ${position[1].toFixed(5)}`
              : "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CitizenLeafletMap;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * CitizenLeafletMap = mapa Leaflet de ciudadano
 * onMarkerChange = al cambiar marcador
 * position = posición
 * setPosition = establecer posición
 * navigator = navegador
 * geolocation = geolocalización
 * getCurrentPosition = obtener posición actual
 * latitude = latitud
 * longitude = longitud
 * positionUpdate = actualizar posición
 * newPosition = nueva posición
 * MapContainer = contenedor de mapa
 * Marker = marcador
 * Popup = ventana emergente
 * TileLayer = capa de mosaicos
 * MapClickHandler = manejador de click en mapa
 */
