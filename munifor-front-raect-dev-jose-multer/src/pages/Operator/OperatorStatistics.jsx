//! ========================================
//! OPERATOR STATISTICS - ESTADÍSTICAS Y GRÁFICOS DEL OPERADOR
//! ========================================
//* Propósito: Página con gráficos estadísticos sobre reportes para el operador
//* Ruta: /operator/statistics
//* Layout: OperatorLayout (con OperatorNavBar)
//* Endpoint: GET /operator/statistics - Obtiene datos para 3 gráficos
//* Características:
//*   - Gráfico de línea: Reportes Aceptados vs Completados por mes
//*   - Gráfico de línea: Tipos de reportes (Bache, Alumbrado, Basura, Otro) por mes
//*   - Gráfico de dona: Distribución de reportes por estado

import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import ChartDoughnut from "../../components/Chart/ChartDoughnut";
import ChartLine from "../../components/Chart/ChartLine";

//? ========================================
//? COMPONENTE PRINCIPAL - OPERATORSTATISTICS
//? ========================================
//* Descripción: Renderiza 3 gráficos con estadísticas de reportes
//* @returns {JSX.Element} - Página con gráficos de Chart.js
//* Uso: Operadores visualizan análisis de reportes
const OperatorStatistics = () => {
  const { getFetchData } = useFetch();

  //? Estados para datos de cada gráfico
  const [doughnutData, setDoughnutData] = useState(null); //* Datos para gráfico de dona (estados de reportes)
  const [lineReportsData, setLineReportsData] = useState(null); //* Datos para gráfico de línea (Aceptados vs Completados)
  const [lineTypesData, setLineTypesData] = useState(null); //* Datos para gráfico de línea (Tipos de reportes)

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const res = await getFetchData("/operator/statistics");
        const data = res.data;
        console.log(data);
        setDoughnutData({
          labels: Object.keys(data.chartDoughnutData),
          datasets: [
            {
              data: Object.values(data.chartDoughnutData),
              backgroundColor: [
                "rgba(16, 185, 129, 0.5)",
                "rgba(245, 158, 11, 0.5)",
                "rgba(239, 68, 68, 0.5)",
                "rgba(37, 99, 235, 0.5)",
                "rgba(156, 163, 175, 0.5)",
              ],
            },
          ],
        });
        setLineReportsData({
          labels: data.chartLineReportsData.months,
          datasets: [
            {
              label: "Aceptado",
              data: data.chartLineReportsData.Aceptado,
              borderColor: "#3b82f6",
              tension: 0.1,
            },
            {
              label: "Completado",
              data: data.chartLineReportsData.Completado,
              borderColor: "#10b981",
              tension: 0.1,
            },
          ],
        });
        setLineTypesData({
          labels: data.chartLineReportTypesData.months,
          datasets: [
            {
              label: "Bache",
              data: data.chartLineReportTypesData.Bache,
              borderColor: "#e74c3c",
              tension: 0.1,
            },
            {
              label: "Alumbrado",
              data: data.chartLineReportTypesData.Alumbrado,
              borderColor: "#f39c12",
              tension: 0.1,
            },
            {
              label: "Basura",
              data: data.chartLineReportTypesData.Basura,
              borderColor: "#27ae60",
              tension: 0.1,
            },
            {
              label: "Otro",
              data: data.chartLineReportTypesData.Otro,
              borderColor: "#9333ea",
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };
    fetchStatistics();
  }, []); //* Se ejecuta al montar

  return (
    <div className="min-h-screen w-full flex flex-row items-center justify-center gap-[2vw] flex-wrap bg-gradient-to-br from-[#eaf4fe] to-[#d2e7fa]">
      {/* ========================================
          GRÁFICO 1: LÍNEA - ACEPTADOS VS COMPLETADOS
          ======================================== 
          * Muestra evolución mensual de reportes aceptados y completados
      */}
      <div className="bg-gray-100 rounded-lg shadow-lg p-4 w-[92%] h-80 flex items-center justify-center">
        <div className="bg-white/80 border-2 border-cyan-300 rounded-2xl shadow-2xl w-full h-full flex items-center justify-center">
          <ChartLine data={lineReportsData} />
        </div>
      </div>

      {/* ========================================
          GRÁFICO 2: LÍNEA - TIPOS DE REPORTES
          ======================================== 
          * Muestra evolución mensual de cada tipo (Bache, Alumbrado, Basura, Otro)
      */}
      <div className="bg-gray-100 rounded-lg shadow-lg p-4 w-[92%] h-80 flex items-center justify-center">
        <div className="bg-white/80 border-2 border-cyan-300 rounded-2xl shadow-2xl w-full h-full flex items-center justify-center">
          <ChartLine data={lineTypesData} />
        </div>
      </div>

      {/* ========================================
          GRÁFICO 3: DONA - DISTRIBUCIÓN POR ESTADO
          ======================================== 
          * Muestra porcentaje de reportes por estado
      */}
      <div className="bg-gray-100 rounded-lg shadow-lg p-4 w-2/5 h-80 flex items-center justify-center">
        <div className="bg-white/80 border-2 border-cyan-300 rounded-2xl shadow-2xl w-full h-full flex items-center justify-center">
          <ChartDoughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
};

export default OperatorStatistics;

//! ========================================
//! TRADUCCIÓN DE CONSTANTES
//! ========================================
//* doughnutData - datos de gráfico de dona
//* lineReportsData - datos de gráfico de línea (reportes)
//* lineTypesData - datos de gráfico de línea (tipos)
//* chartDoughnutData - datos de gráfico de dona
//* chartLineReportsData - datos de gráfico de línea (reportes)
//* chartLineReportTypesData - datos de gráfico de línea (tipos de reportes)
//* months - meses
//* Aceptado - Accepted
//* Completado - Completed
//* Bache - Pothole
//* Alumbrado - Street Light
//* Basura - Trash
//* Otro - Other
