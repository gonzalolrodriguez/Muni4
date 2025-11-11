//! ========================================
//! OPERATOR MAP - MAPA GLOBAL PARA OPERADORES
//! ========================================
//* Propósito: Página que muestra el mapa global con reportes y funcionalidades del operador
//* Ruta: /operator/map
//* Layout: OperatorLayout (con OperatorNavBar)
//* Características:
//*   - Muestra todos los reportes en el mapa de Formosa
//*   - Panel lateral con filtros (estado, tipo de reporte, fecha)
//*   - Panel de detalles al hacer clic en marcador
//*   - Funcionalidades específicas del operador (aceptar, rechazar, asignar tareas)

import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import GlobalLeafletMap from "../../components/LeafletMaps/GlobalLeafletMap";

//? ========================================
//? COMPONENTE PRINCIPAL - OPERATORMAP
//? ========================================
//* Descripción: Renderiza el mapa global configurado para el rol de operador
//* @returns {JSX.Element} - Mapa Leaflet con funcionalidades de operador
//* Uso: Operadores visualizan y gestionan reportes desde el mapa
const OperatorMap = () => {
  //? Obtiene usuario actual del contexto (necesario para pasar el rol)
  const { user } = useContext(UserContext);

  return (
    <div className="w-full h-full">
      {/*
       * GlobalLeafletMap renderiza mapa con:
       * - Marcadores de reportes con colores según estado
       * - Filtros laterales (AsideFilterMap)
       * - Panel de detalles (AsideDetailsPanel)
       * - Botones de acción según rol (aceptar/rechazar reportes, crear tareas)
       */}
      <GlobalLeafletMap role={user?.role} />
    </div>
  );
};
export default OperatorMap;

//! ========================================
//! TRADUCCIÓN DE CONSTANTES
//! ========================================
//* user - usuario
//* role - rol
//* GlobalLeafletMap - Mapa Global Leaflet
//* Map - Mapa
