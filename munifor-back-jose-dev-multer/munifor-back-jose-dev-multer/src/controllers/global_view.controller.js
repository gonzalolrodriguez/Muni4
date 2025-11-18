import ReportModel from "../models/report.model.js";
import TaskModel from "../models/task.model.js";
import CrewModel from "../models/crew.model.js";
import ProgressReportModel from "../models/progress_report.model.js";

/**
 * Vista global del sistema para el administrador
 * Devuelve todos los reports, tasks, crews y progress
 * @route GET /api/admin/globalview
 */
export const getGlobalView = async (req, res) => {
  try {
    const reports = await ReportModel.find({}).sort({ created_at: -1 }); // Ordenar por fecha de creación descendente
    const tasks = await TaskModel.find({}).sort({ created_at: -1 }); // Ordenar por fecha de creación descendente
    const crews = await CrewModel.find({}).sort({ created_at: -1 }); // Ordenar por fecha de creación descendente
    const progress = await ProgressReportModel.find({}).sort({
      created_at: -1,
    }); // Ordenar por fecha de creación descendente
    return res.status(200).json({
      ok: true,
      data: {
        reports,
        tasks,
        crews,
        progress,
      },
    });
  } catch (error) {
    console.error("Error en getGlobalView:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
    });
  }
};
