//* ========================================
//* COMPONENTE: MapClickHandler
//* ========================================
//* Propósito: Componente invisible de Leaflet para capturar clicks en el mapa
//* Usado en: CitizenLeafletMap, CreateTaskModal (seleccionar ubicación en mapa)
//* Props:
//*   - onClickPosition: función - Callback que recibe [lat, lng] cuando se hace click
//* Funcionalidad:
//*   - Escucha evento "click" en el mapa
//*   - Pasa coordenadas [lat, lng] al callback
//*   - Hace flyTo en el mapa a la posición clickeada
//* Nota: No renderiza nada visible (return null)

import { useMapEvents } from "react-leaflet";

const MapClickHandler = ({ onClickPosition }) => {
  //* Hook de Leaflet: Escuchar eventos del mapa
  const map = useMapEvents({
    //? Evento: Click en el mapa
    click(e) {
      //! Pasar coordenadas al callback del padre
      onClickPosition([e.latlng.lat, e.latlng.lng]);

      //* Animación: Volar a la nueva posición
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  //? Este componente no renderiza nada visible
  return null;
};
export default MapClickHandler;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * MapClickHandler = manejador de click en mapa
 * onClickPosition = al hacer click en posición
 * map = mapa
 * useMapEvents = usar eventos del mapa
 * click = click
 * e = evento
 * latlng = latitud-longitud
 * lat = latitud
 * lng = longitud
 * flyTo = volar a
 * getZoom = obtener zoom
 */
