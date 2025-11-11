//* ========================================
//* COMPONENTE: ReportLeafletMap
//* ========================================
//* Propósito: Mapa de Leaflet simple para mostrar ubicación fija de un reporte
//* Usado en: ReportModal, ReportDetails (ver ubicación del reporte)
//* Props:
//*   - location: objeto - {lat, lng} coordenadas del reporte
//* Características:
//*   - Mapa centrado en la ubicación del reporte
//*   - Marcador fijo en la ubicación
//*   - Scroll deshabilitado (solo vista)
//*   - Zoom fijo en 15

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ReportLeafletMap = ({ location }) => {
  const { lat, lng } = location;
  return (
    <div className="w-96 h-96 mt-4 border rounded-lg overflow-hidden">
      {/* //! MapContainer: Mapa de Leaflet centrado en ubicación del reporte */}
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false} // Deshabilitar scroll en el mapa
        className="w-full h-full"
      >
        {/* //? TileLayer: Capa de OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* //? Marker: Marcador en la ubicación del reporte */}
        <Marker position={[lat, lng]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
export default ReportLeafletMap;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * ReportLeafletMap = mapa Leaflet de reporte
 * location = ubicación
 * lat = latitud
 * lng = longitud
 * MapContainer = contenedor de mapa
 * Marker = marcador
 * Popup = ventana emergente
 * TileLayer = capa de mosaicos
 */
