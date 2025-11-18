//! ========================================
//! ADMIN MAP - MAPA GLOBAL PARA ADMINISTRADORES
//! ========================================
//* Propósito: Página que muestra el mapa global con reportes y funcionalidades del administrador
//* Ruta: /admin/map
//* Layout: AdminLayout (con AdminNavBar)
//* Características:
//*   - Muestra todos los reportes en el mapa de Formosa
//*   - Panel lateral con filtros (estado, tipo de reporte, fecha)
//*   - Panel de detalles al hacer clic en marcador
//*   - Funcionalidades específicas del administrador (visualización completa)

import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import GlobalLeafletMap from "../../components/LeafletMaps/GlobalLeafletMap";

//? ========================================
//? COMPONENTE PRINCIPAL - ADMINMAP
//? ========================================
//* Descripción: Renderiza el mapa global configurado para el rol de administrador
//* @returns {JSX.Element} - Mapa Leaflet con funcionalidades de administrador
//* Uso: Administradores visualizan y monitorean todos los reportes desde el mapa
const AdminMap = () => {
  //? Obtiene usuario actual del contexto (necesario para pasar el rol)
  const { user } = useContext(UserContext);

  return (
    <div className="w-full h-full relative">
      <GlobalLeafletMap role={"Administrador"} />
    </div>
  );
};
export default AdminMap;

//! ========================================
//! TRADUCCIÓN DE CONSTANTES
//! ========================================
//* user - usuario
//* role - rol
//* GlobalLeafletMap - Mapa Global Leaflet
//* Map - Mapa
