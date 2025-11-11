//* ========================================
//* COMPONENTE: ChartLine
//* ========================================
//* Propósito: Gráfico de línea reutilizable con Chart.js
//* Usado en: AdminStatistics, OperatorStatistics (tendencias temporales)
//* Props:
//*   - data: objeto - Datos del gráfico en formato Chart.js
//*     {
//*       labels: ["Enero", "Febrero", ...],
//*       datasets: [{ label: "Reportes", data: [10, 20, ...], borderColor: "#color", ... }]
//*     }
//* Retorna null si no hay datos
//* Uso común: Mostrar evolución temporal de métricas

import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";

const ChartLine = ({ data }) => {
  //? Si no hay datos, no renderizar nada
  if (!data) return null;

  //* Renderizar gráfico de línea
  return <Line data={data} />;
};

export default ChartLine;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * ChartLine = gráfico de línea
 * data = datos
 * Line = línea (componente de Chart.js)
 */
