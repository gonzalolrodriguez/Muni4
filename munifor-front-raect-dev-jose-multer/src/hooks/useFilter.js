//* ========================================
//* HOOK: useFilter
//* ========================================
//* Propósito: Hook centralizado para filtrado de datos en MuniFor
//* Aplica a: Reports, Tasks, ProgressReports, Users
//* Características:
//*   - Búsqueda por texto en cualquier campo
//*   - Filtros por estado/tipo/prioridad
//*   - Filtros de tiempo (desde 1 hora hasta 1 año)
//*   - Paginación de datos
//*   - Ordenamiento personalizado
//*   - Encadenamiento de filtros
//* Usado en: GlobalLeafletMap, AdminDashboard, OperatorMap, etc.

const useFilter = () => {
  //* ========================================
  //* FILTRO 1: BÚSQUEDA POR TEXTO
  //* ========================================
  //* Propósito: Filtrar elementos por un campo específico
  //* Características:
  //*   - Búsqueda insensible a mayúsculas
  //*   - Soporta campos anidados (ej: 'profile.first_name')
  //*   - Retorna todos los datos si no hay término de búsqueda
  //* @param {Array} data - Array de objetos a filtrar
  //* @param {String} searchTerm - Término de búsqueda
  //* @param {String} field - Campo donde buscar (ej: 'title', 'username')
  //* @returns {Array} - Datos filtrados
  //* Ejemplos de uso:
  //*   - filterBySearch(reports, "bache", "title")
  //*   - filterBySearch(users, "juan", "username")
  //*   - filterBySearch(users, "maria", "profile.first_name")
  const filterBySearch = (data, searchTerm, field) => {
    //? Si no hay término de búsqueda, retorna todos los datos
    if (!searchTerm || searchTerm.trim() === "") return data;

    //* Convierte el término de búsqueda a minúsculas y quita espacios
    const term = searchTerm.toLowerCase().trim();

    return data.filter((item) => {
      //! Maneja campos anidados (ej: 'profile.first_name')
      //* Split por '.' para acceder a propiedades anidadas
      //* Usa reduce para navegar por el objeto hasta llegar al valor final
      const value = field.split(".").reduce((obj, key) => obj?.[key], item);

      //* Convierte el valor a string, luego a minúsculas y verifica si contiene el término
      return value?.toString().toLowerCase().includes(term);
    });
  };

  //* ========================================
  //* FILTRO 2: ESTADO DE REPORTES
  //* ========================================
  //* Propósito: Filtrar reportes por estado
  //* Estados válidos: Pendiente, Revisado, Aceptado, Completado, Rechazado, Todos
  //* @param {Array} reports - Array de reportes
  //* @param {String} status - Estado a filtrar
  //* @returns {Array} - Reportes filtrados
  const filterReportsByStatus = (reports, status) => {
    if (!status || status === "Todos") return reports;
    return reports.filter((report) => report.status === status);
  };

  //* ========================================
  //* FILTRO 3: TIPO DE REPORTE
  //* ========================================
  //* Propósito: Filtrar reportes por tipo
  //* Tipos válidos: Bache, Alumbrado, Basura, Incidente, Otro, Todos
  //* @param {Array} reports - Array de reportes
  //* @param {String} type - Tipo a filtrar
  //* @returns {Array} - Reportes filtrados
  const filterReportsByType = (reports, type) => {
    if (!type || type === "Todos") return reports;
    return reports.filter((report) => report.type_report === type);
  };

  //* ========================================
  //* FILTRO 4: ESTADO DE TAREAS
  //* ========================================
  //* Propósito: Filtrar tareas por estado
  //* Estados válidos: Pendiente, En Progreso, Finalizada, Todos
  //* @param {Array} tasks - Array de tareas
  //* @param {String} status - Estado a filtrar
  //* @returns {Array} - Tareas filtradas
  const filterTasksByStatus = (tasks, status) => {
    if (!status || status === "Todos") return tasks;
    return tasks.filter((task) => task.status === status);
  };

  //* ========================================
  //* FILTRO 5: TIPO DE TAREA (task_type)
  //* ========================================
  //* Propósito: Filtrar tareas por tipo de tarea
  //* Tipos: Reparación, Mantenimiento, Limpieza, Otro, Todos
  //* @param {Array} tasks - Array de tareas
  //* @param {String} taskType - Tipo de tarea
  //* @returns {Array} - Tareas filtradas
  const filterTasksByTaskType = (tasks, taskType) => {
    if (!taskType || taskType === "Todos") return tasks;
    return tasks.filter((task) => task.task_type === taskType);
  };

  //* ========================================
  //* FILTRO 6: PRIORIDAD DE TAREAS
  //* ========================================
  //* Propósito: Filtrar tareas por nivel de prioridad
  //* Prioridades: Baja, Media, Alta, Todos
  //* Usado en: Tableros de tareas, mapas, dashboards
  //* @param {Array} tasks - Array de tareas
  //* @param {String} priority - Prioridad a filtrar
  //* @returns {Array} - Tareas filtradas
  const filterTasksByPriority = (tasks, priority) => {
    if (!priority || priority === "Todos") return tasks;
    return tasks.filter((task) => task.priority === priority);
  };

  //* ========================================
  //* FILTRO 7: ESTADO DE AVANCE
  //* ========================================
  //* Propósito: Filtrar reportes de progreso por estado
  //* Estados: Pendiente, En Progreso, Finalizado, Todos
  //* Usado en: WorkerProgress, OperatorDashboard
  //* @param {Array} progressReports - Array de reportes de progreso
  //* @param {String} status - Estado a filtrar
  //* @returns {Array} - Reportes de progreso filtrados
  const filterProgressByStatus = (progressReports, status) => {
    if (!status || status === "Todos") return progressReports;
    return progressReports.filter((progress) => progress.status === status);
  };

  //* ========================================
  //* FILTRO 8: FILTRO POR TIEMPO
  //* ========================================
  //* Propósito: Filtrar datos por rango de tiempo basado en created_at
  //* Rangos disponibles:
  //*   - '1h': Última hora
  //*   - '6h': Últimas 6 horas
  //*   - '12h': Últimas 12 horas
  //*   - '24h': Últimas 24 horas
  //*   - '7d': Última semana
  //*   - '1m': Último mes (30 días)
  //*   - '3m': Últimos 3 meses (90 días)
  //*   - '6m': Últimos 6 meses (180 días)
  //*   - '1y': Último año (365 días)
  //*   - 'all': Todos los datos (sin filtro)
  //* @param {Array} data - Array de objetos con campo created_at
  //* @param {String} timeRange - Rango de tiempo
  //* @returns {Array} - Datos filtrados
  const filterByTime = (data, timeRange) => {
    if (!timeRange || timeRange === "all") return data;

    const now = new Date();

    //* Objeto con conversiones de tiempo a milisegundos
    const ranges = {
      "1h": 1 * 60 * 60 * 1000, // 1 hora
      "6h": 6 * 60 * 60 * 1000, // 6 horas
      "12h": 12 * 60 * 60 * 1000, // 12 horas
      "24h": 24 * 60 * 60 * 1000, // 24 horas
      "7d": 7 * 24 * 60 * 60 * 1000, // 7 días (1 semana)
      "1m": 30 * 24 * 60 * 60 * 1000, // 30 días (1 mes)
      "3m": 90 * 24 * 60 * 60 * 1000, // 90 días (3 meses)
      "6m": 180 * 24 * 60 * 60 * 1000, // 180 días (6 meses)
      "1y": 365 * 24 * 60 * 60 * 1000, // 365 días (1 año)
    };

    //? Calcular el límite de tiempo: ahora - rango seleccionado
    //* Ejemplo: Si son las 10:00 y seleccionas '1h', el límite es 09:00
    const timeLimit = now.getTime() - (ranges[timeRange] || 0);

    return data.filter((item) => {
      //* Convertir created_at del item a timestamp
      const itemDate = new Date(item.created_at).getTime();
      //* Retornar solo si la fecha del item es mayor o igual al límite
      return itemDate >= timeLimit;
    });
  };

  //* ========================================
  //* FILTRO COMBINADO PARA MAPA
  //* ========================================
  //* Propósito: Filtro dinámico para GlobalLeafletMap (Operador/Admin)
  //* Permite combinar múltiples filtros en una sola función
  //* Usado específicamente en: GlobalLeafletMap.jsx
  //* @param {Object} data - Objeto con arrays ({ reports, tasks, progress })
  //* @param {Object} filters - Objeto con los filtros a aplicar
  //* @param {String} filters.dataType - Tipo ('report', 'task', 'progress')
  //* @param {String} filters.status - Estado a filtrar
  //* @param {String} filters.type - Tipo a filtrar
  //* @param {String} filters.priority - Prioridad (solo para tasks)
  //* @param {String} filters.timeRange - Rango de tiempo
  //* @returns {Array} - Datos filtrados y listos para mostrar en mapa
  const filterForMap = (data, filters = {}) => {
    const { dataType, status, type, priority, timeRange } = filters;

    //? PASO 1: Seleccionar el conjunto de datos correcto según el tipo
    let selectedData = [];
    switch (dataType) {
      case "report":
        selectedData = data.reports || [];
        break;
      case "task":
        selectedData = data.tasks || [];
        break;
      case "progress":
        selectedData = data.progress || [];
        break;
      default:
        //! Si no se especifica tipo, devolver todos combinados
        selectedData = [
          ...(data.reports || []),
          ...(data.tasks || []),
          ...(data.progress || []),
        ];
        break;
    }

    let filteredData = [...selectedData];

    //? PASO 2: Aplicar filtro de tiempo primero (si existe)
    //* El filtro de tiempo se aplica primero porque es el más general
    if (timeRange) {
      filteredData = filterByTime(filteredData, timeRange);
    }

    //? PASO 3: Aplicar filtros específicos según el tipo de dato
    switch (dataType) {
      case "report":
        if (status) filteredData = filterReportsByStatus(filteredData, status);
        if (type) filteredData = filterReportsByType(filteredData, type);
        break;

      case "task":
        if (status) filteredData = filterTasksByStatus(filteredData, status);
        if (priority)
          filteredData = filterTasksByPriority(filteredData, priority);
        if (type) filteredData = filterTasksByTaskType(filteredData, type);
        break;

      case "progress":
        if (status) filteredData = filterProgressByStatus(filteredData, status);
        break;

      default:
        break;
    }

    return filteredData;
  };

  //* ========================================
  //* PAGINACIÓN Y LÍMITE DE DATOS
  //* ========================================
  //* Propósito: Limitar cantidad de datos mostrados
  //* Útil para mapas y listas largas para mejorar rendimiento
  //* @param {Array} data - Array de datos
  //* @param {Number} limit - Cantidad máxima por página (default: 50)
  //* @param {Number} page - Página actual (default: 1)
  //* @returns {Object} - Objeto con datos paginados y metadata
  //* Retorna:
  //*   - data: Array con los datos de la página actual
  //*   - totalPages: Cantidad total de páginas
  //*   - hasMore: Boolean indicando si hay más páginas
  //*   - currentPage: Página actual
  //*   - totalItems: Cantidad total de items
  const limitData = (data, limit = 50, page = 1) => {
    //* Calcular índice inicial: (página - 1) * límite
    //* Ejemplo: página 2, límite 50 → startIndex = 50
    const startIndex = (page - 1) * limit;

    //* Calcular índice final: índice inicial + límite
    //* Ejemplo: startIndex 50, límite 50 → endIndex = 100
    const endIndex = startIndex + limit;

    //* Extraer el segmento de datos correspondiente a esta página
    const paginatedData = data.slice(startIndex, endIndex);

    //* Calcular total de páginas redondeando hacia arriba
    //* Ejemplo: 125 items / 50 por página = 2.5 → 3 páginas
    const totalPages = Math.ceil(data.length / limit);

    //* Verificar si hay más páginas disponibles
    const hasMore = page < totalPages;

    return {
      data: paginatedData, // Datos de la página actual
      totalPages, // Total de páginas
      hasMore, // ¿Hay más páginas?
      currentPage: page, // Página actual
      totalItems: data.length, // Total de items en todos los datos
    };
  };

  //* ========================================
  //* ORDENAMIENTO
  //* ========================================
  //* Propósito: Ordenar datos por un campo específico
  //* Soporta: fechas, strings, números, campos anidados
  //* @param {Array} data - Array de datos
  //* @param {String} field - Campo por el cual ordenar (default: 'created_at')
  //* @param {String} order - Orden: 'asc' (ascendente) o 'desc' (descendente)
  //* @returns {Array} - Datos ordenados
  const sortData = (data, field = "created_at", order = "desc") => {
    //! Crear copia del array para no mutar el original
    return [...data].sort((a, b) => {
      //? Obtener valores de los campos (soporta campos anidados)
      const valueA = field.split(".").reduce((obj, key) => obj?.[key], a);
      const valueB = field.split(".").reduce((obj, key) => obj?.[key], b);

      //* CASO 1: Manejar fechas (campos que terminan en '_at')
      if (field.includes("_at")) {
        const dateA = new Date(valueA).getTime();
        const dateB = new Date(valueB).getTime();
        return order === "asc" ? dateA - dateB : dateB - dateA;
      }

      //* CASO 2: Manejar strings (usar localeCompare)
      if (typeof valueA === "string") {
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      //* CASO 3: Manejar números (restar directamente)
      return order === "asc" ? valueA - valueB : valueB - valueA;
    });
  };

  //* ========================================
  //* FILTRO COMBINADO GENERAL
  //* ========================================
  //* Propósito: Aplicar múltiples filtros de forma encadenada
  //* Útil cuando necesitas aplicar varios filtros a la vez
  //* @param {Array} data - Array de datos
  //* @param {Array} filterChain - Array de funciones de filtro
  //* @returns {Array} - Datos filtrados
  //* Ejemplo de uso:
  //*   const filtered = applyFilters(reports, [
  //*     (data) => filterBySearch(data, "bache", "title"),
  //*     (data) => filterReportsByStatus(data, "Pendiente"),
  //*     (data) => filterByTime(data, "24h")
  //*   ]);
  const applyFilters = (data, filterChain = []) => {
    //! Usa reduce para aplicar cada filtro secuencialmente
    //* El resultado de cada filtro se pasa como entrada al siguiente
    return filterChain.reduce((filtered, filterFn) => filterFn(filtered), data);
  };

  //* ========================================
  //* RETURN: Exportar todas las funciones de filtrado
  //* ========================================
  return {
    //* FILTROS INDIVIDUALES
    filterBySearch, // Filtro 1: Búsqueda por texto en cualquier campo
    filterReportsByStatus, // Filtro 2: Estado de reportes
    filterReportsByType, // Filtro 3: Tipo de reporte
    filterTasksByStatus, // Filtro 4: Estado de tareas
    filterTasksByTaskType, // Filtro 5: Tipo de tarea
    filterTasksByPriority, // Filtro 6: Prioridad de tareas
    filterProgressByStatus, // Filtro 7: Estado de avance
    filterByTime, // Filtro 8: Rango de tiempo

    //* FILTROS COMBINADOS
    filterForMap, // Filtro dinámico para mapa (combina múltiples filtros)

    //* UTILIDADES
    limitData, // Paginación de datos
    sortData, // Ordenamiento por campo
    applyFilters, // Encadenamiento de filtros
  };
};

export default useFilter;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * data = datos
 * searchTerm = término de búsqueda
 * field = campo
 * term = término
 * item = elemento
 * value = valor
 * reports = reportes
 * status = estado
 * type = tipo
 * tasks = tareas
 * taskType = tipo de tarea
 * priority = prioridad
 * progressReports = reportes de progreso
 * progress = progreso / avance
 * timeRange = rango de tiempo
 * now = ahora
 * ranges = rangos
 * timeLimit = límite de tiempo
 * itemDate = fecha del elemento
 * filters = filtros
 * dataType = tipo de dato
 * selectedData = datos seleccionados
 * filteredData = datos filtrados
 * limit = límite
 * page = página
 * startIndex = índice inicial
 * endIndex = índice final
 * paginatedData = datos paginados
 * totalPages = total de páginas
 * hasMore = tiene más
 * currentPage = página actual
 * totalItems = total de elementos
 * order = orden
 * valueA = valor A
 * valueB = valor B
 * dateA = fecha A
 * dateB = fecha B
 * filterChain = cadena de filtros
 * filtered = filtrado
 * filterFn = función de filtro
 * filterBySearch = filtrar por búsqueda
 * filterReportsByStatus = filtrar reportes por estado
 * filterReportsByType = filtrar reportes por tipo
 * filterTasksByStatus = filtrar tareas por estado
 * filterTasksByTaskType = filtrar tareas por tipo de tarea
 * filterTasksByPriority = filtrar tareas por prioridad
 * filterProgressByStatus = filtrar progreso por estado
 * filterByTime = filtrar por tiempo
 * filterForMap = filtrar para mapa
 * limitData = limitar datos
 * sortData = ordenar datos
 * applyFilters = aplicar filtros
 */
