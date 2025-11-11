//* ========================================
//* COMPONENTE: ChartBar
//* ========================================
//* Propósito: Gráfico de barras reutilizable con Chart.js
//* Usado en: AdminStatistics, OperatorStatistics (cualquier página que necesite gráfico de barras)
//* Props:
//*   - data: objeto - Datos del gráfico en formato Chart.js
//*     {
//*       labels: ["Label1", "Label2", ...],
//*       datasets: [{ label: "Dataset 1", data: [10, 20, ...], backgroundColor: "#color", ... }]
//*     }
//* Retorna null si no hay datos

import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";

const ChartBar = ({ data }) => {
  //? Si no hay datos, no renderizar nada
  if (!data) return null;

  //* Renderizar gráfico de barras
  return <Bar data={data} />;
};
export default ChartBar;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * ChartBar = gráfico de barras
 * data = datos
 * Bar = barra (componente de Chart.js)
 */
