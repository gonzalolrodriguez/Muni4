//* ========================================
//* PÁGINA: Home
//* ========================================
//* Propósito: Página de inicio para usuarios no autenticados
//* Ruta: / (ruta raíz)
//* Layout: GeneralLayout
//* Características:
//*   - Landing page del sistema
//*   - Accesible sin autenticación
//*   - TODO: Agregar contenido de bienvenida, información del municipio, etc.

const Home = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800">
      <div className="max-w-xl w-full px-6 py-12 rounded-xl shadow-lg bg-white/80 backdrop-blur-md text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">Bienvenido a MuniFor</h1>
        <p className="mb-6 text-lg text-gray-600">Gestiona reportes, tareas y equipos municipales de forma eficiente y moderna.</p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a href="/register" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Registrarse</a>
          <a href="/login" className="px-6 py-2 rounded-lg bg-white border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition">Iniciar sesión</a>
        </div>
      </div>
    </section>
  );
};

export default Home;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * Home = inicio
 */
