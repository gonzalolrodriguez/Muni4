//* ========================================
//* COMPONENTE: ChartDoughnut
//* ========================================
//* Propósito: Gráfico de dona (doughnut) reutilizable con Chart.js
//* Usado en: AdminStatistics, OperatorStatistics, Dashboards
//* Props:
//*   - data: objeto - Datos del gráfico en formato Chart.js
//*     {
//*       labels: ["Label1", "Label2", ...],
//*       datasets: [{ data: [10, 20, ...], backgroundColor: ["#color1", "#color2", ...], ... }]
//*     }
//* Retorna null si no hay datos
//* Uso común: Mostrar distribución porcentual de categorías

import { Chart as ChartJS } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";

const ChartDoughnut = ({ data }) => {
  //? Si no hay datos, no renderizar nada
  if (!data) return null;

  //* Renderizar gráfico de dona
  return <Doughnut data={data} />;
};
export default ChartDoughnut;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * ChartDoughnut = gráfico de dona
 * data = datos
 * Doughnut = dona (componente de Chart.js)
 */
