//! ===============================================
//! ADMIN STATISTICS - Estadísticas con gráficos
//! ===============================================
//* Ruta: /admin/statistics
//* Layout: AdminLayout
//* Acceso: Solo rol "Administrador"

//* Propósito:
//? Página de estadísticas con 4 gráficos visuales del sistema
//? Endpoint: GET /admin/statistics
//? Muestra usuarios por rol, reportes por estado, reportes mensuales y tipos de reporte

import { useEffect, useState } from "react";
import ChartBar from "../../components/Chart/ChartBar";
import ChartDoughnut from "../../components/Chart/ChartDoughnut";
import ChartLine from "../../components/Chart/ChartLine";
import useFetch from "../../hooks/useFetch";

/**
 * * Componente AdminStatistics
 * ? Página de estadísticas visuales para administradores
 * @returns {JSX.Element} Dashboard con 4 gráficos estadísticos
 *
 * Características:
 * - Gráfico de barras: Usuarios por rol (Ciudadano, Operador, Trabajador, Administrador)
 * - Gráfico de donas: Reportes por estado (Nuevo, Aceptado, Completado, etc.)
 * - Gráfico de líneas 1: Reportes mensuales (Aceptado vs Completado)
 * - Gráfico de líneas 2: Tipos de reporte mensuales (Bache, Alumbrado, Basura, Otro)
 */
const AdminStatistics = () => {
  const { getFetchData } = useFetch();

  //? Estados para almacenar los datos de cada gráfico
  const [barData, setBarData] = useState(null); //* Datos para gráfico de barras (usuarios por rol)
  const [doughnutData, setDoughnutData] = useState(null); //* Datos para gráfico de donas (reportes por estado)
  const [lineReportsData, setLineReportsData] = useState(null); //* Datos para gráfico de líneas (reportes mensuales)
  const [lineTypesData, setLineTypesData] = useState(null); //* Datos para gráfico de líneas (tipos mensuales)

  /**
   * * useEffect - Cargar estadísticas del sistema
   * ? Se ejecuta al montar el componente
   * ! Endpoint: GET /admin/statistics
   * ! Estructura de respuesta esperada:
   * ! {
   * !   data: {
   * !     chartBarData: { Ciudadano: N, Operador: N, Trabajador: N, Administrador: N },
   * !     chartDoughnutData: { Nuevo: N, Aceptado: N, Completado: N, Rechazado: N, ... },
   * !     chartLineReportsData: { months: [...], Aceptado: [...], Completado: [...] },
   * !     chartLineReportTypesData: { months: [...], Bache: [...], Alumbrado: [...], Basura: [...], Otro: [...] }
   * !   }
   * ! }
   */
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const res = await getFetchData("/admin/statistics");
        const data = res.data;
        console.log(data);

        //* ====== Configurar gráfico de barras (Usuarios por rol) ======
        setBarData({
          labels: Object.keys(data.chartBarData), //? ["Ciudadano", "Operador", "Trabajador", "Administrador"]
          datasets: [
            {
              label: "Usuarios por rol",
              data: Object.values(data.chartBarData), //? [120, 15, 30, 5] (ejemplo)
              backgroundColor: [
                "rgba(16, 185, 129, 0.5)", //* Verde para Ciudadano
                "rgba(245, 158, 11, 0.5)", //* Amarillo para Operador
                "rgba(239, 68, 68, 0.5)", //* Rojo para Trabajador
                "rgba(37, 99, 235, 0.5)", //* Azul para Administrador
              ],
            },
          ],
        });

        //* ====== Configurar gráfico de donas (Reportes por estado) ======
        setDoughnutData({
          labels: Object.keys(data.chartDoughnutData), //? ["Nuevo", "Aceptado", "Completado", "Rechazado", ...]
          datasets: [
            {
              data: Object.values(data.chartDoughnutData), //? [50, 30, 80, 10, 5] (ejemplo)
              backgroundColor: [
                "rgba(16, 185, 129, 0.5)", //* Verde
                "rgba(245, 158, 11, 0.5)", //* Amarillo
                "rgba(239, 68, 68, 0.5)", //* Rojo
                "rgba(37, 99, 235, 0.5)", //* Azul
                "rgba(156, 163, 175, 0.5)", //* Gris
              ],
            },
          ],
        });

        //* ====== Configurar gráfico de líneas 1 (Reportes mensuales Aceptado vs Completado) ======
        setLineReportsData({
          labels: data.chartLineReportsData.months, //? ["Ene", "Feb", "Mar", ...]
          datasets: [
            {
              label: "Aceptado",
              data: data.chartLineReportsData.Aceptado, //? [10, 15, 20, ...] reportes aceptados por mes
              borderColor: "#3b82f6", //* Línea azul
              tension: 0.1, //? Curvatura de la línea
            },
            {
              label: "Completado",
              data: data.chartLineReportsData.Completado, //? [8, 12, 18, ...] reportes completados por mes
              borderColor: "#10b981", //* Línea verde
              tension: 0.1,
            },
          ],
        });

        //* ====== Configurar gráfico de líneas 2 (Tipos de reporte mensuales) ======
        setLineTypesData({
          labels: data.chartLineReportTypesData.months, //? ["Ene", "Feb", "Mar", ...]
          datasets: [
            {
              label: "Bache",
              data: data.chartLineReportTypesData.Bache, //? Reportes de baches por mes
              borderColor: "#e74c3c", //* Línea roja
              tension: 0.1,
            },
            {
              label: "Alumbrado",
              data: data.chartLineReportTypesData.Alumbrado, //? Reportes de alumbrado por mes
              borderColor: "#f39c12", //* Línea naranja
              tension: 0.1,
            },
            {
              label: "Basura",
              data: data.chartLineReportTypesData.Basura, //? Reportes de basura por mes
              borderColor: "#27ae60", //* Línea verde
              tension: 0.1,
            },
            {
              label: "Otro",
              data: data.chartLineReportTypesData.Otro, //? Otros tipos de reporte por mes
              borderColor: "#9333ea", //* Línea morada
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };
    fetchStatistics();
  }, []);

  //? ============================================
  //? RENDERIZADO JSX
  //? ============================================
  return (
    <div className="min-h-screen w-full flex flex-row items-center justify-center gap-[2vw] flex-wrap bg-gray-300">
      {/* ====== Gráfico 1: Reportes mensuales (Aceptado vs Completado) ====== */}
      {/*//* Muestra la evolución mensual de reportes aceptados y completados */}
      <div className="bg-gray-100 rounded-lg shadow-lg p-4 w-[92%] h-80 flex items-center justify-center">
        <ChartLine data={lineReportsData} />
      </div>

      {/* ====== Gráfico 2: Tipos de reporte mensuales (Bache, Alumbrado, Basura, Otro) ====== */}
      {/*//* Muestra la distribución mensual de cada tipo de reporte */}
      <div className="bg-gray-100 rounded-lg shadow-lg p-4 w-[92%] h-80 flex items-center justify-center">
        <ChartLine data={lineTypesData} />
      </div>

      {/* ====== Gráfico 3: Usuarios por rol (Barras) ====== */}
      {/*//* Muestra cuántos usuarios hay de cada rol (Ciudadano, Operador, Trabajador, Administrador) */}
      <div className="bg-gray-100 rounded-lg shadow-lg p-4 w-1/2 h-80 flex items-center justify-center">
        <ChartBar data={barData} />
      </div>

      {/* ====== Gráfico 4: Reportes por estado (Donas) ====== */}
      {/*//* Muestra la distribución de reportes según su estado (Nuevo, Aceptado, Completado, etc.) */}
      <div className="bg-gray-100 rounded-lg shadow-lg p-4 w-2/5 h-80 flex items-center justify-center">
        <ChartDoughnut data={doughnutData} />
      </div>
    </div>
  );
};

export default AdminStatistics;

//! ===============================================
//! TRADUCCIÓN DE CONSTANTES
//! ===============================================
/**
 * ESPAÑOL | INGLÉS
 * ----------------
 * barData = datos de barras
 * doughnutData = datos de donas
 * lineReportsData = datos de líneas de reportes
 * lineTypesData = datos de líneas de tipos
 * fetchStatistics = obtener estadísticas
 * chartBarData = datos de gráfico de barras
 * chartDoughnutData = datos de gráfico de donas
 * chartLineReportsData = datos de gráfico de líneas de reportes
 * chartLineReportTypesData = datos de gráfico de líneas de tipos de reporte
 * labels = etiquetas
 * datasets = conjuntos de datos
 * backgroundColor = color de fondo
 * borderColor = color de borde
 * tension = tensión (curvatura de línea)
 */
