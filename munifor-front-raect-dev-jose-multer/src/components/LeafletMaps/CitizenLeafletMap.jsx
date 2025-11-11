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
    <div className="w-96 h-96 mt-4 border rounded-lg overflow-hidden">
      {/* //? CASO 1: Mapa cargado con posición */}
      {position && (
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom={true} // Permitir scroll para zoom
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* //? Marcador en la posición actual/seleccionada */}
          <Marker position={position}>
            <Popup>
              📍 {position[0].toFixed(5)}, {position[1].toFixed(5)} <br />
              Ubicación seleccionada
            </Popup>
          </Marker>
          {/* //! MapClickHandler: Permite cambiar posición haciendo click */}
          <MapClickHandler onClickPosition={positionUpdate} />
        </MapContainer>
      )}

      {/* //? CASO 2: Cargando (mientras obtiene geolocalización) */}
      {!position && (
        <p className="text-center mt-4 text-gray-500">
          Obteniendo ubicación...
        </p>
      )}
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
