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
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-10 flex flex-col gap-8 border border-blue-100">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-2 text-center tracking-tight">Bienvenido a MuniFor</h1>
        <p className="text-gray-600 text-center mb-6">Gestiona reportes, tareas y avances de tu ciudad de forma fácil y rápida.</p>
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
