//* ========================================
//* PÁGINA: FAQ
//* ========================================
//* Propósito: Página de preguntas frecuentes
//* Ruta: /faq
//* Layout: GeneralLayout
//* Características:
//*   - Información sobre el sistema
//*   - Ayuda para usuarios
//*   - Accesible sin autenticación
//*   - TODO: Agregar más preguntas y respuestas relevantes

const FAQ = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#eaf4fe]">
      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-10 border border-cyan-200">
        <h1 className="text-3xl font-extrabold text-cyan-700 mb-6 text-center">Preguntas Frecuentes</h1>
        {/* //? Lista de preguntas frecuentes */}
        <ul className="space-y-6">
          <li className="bg-cyan-50 rounded-xl p-4 shadow">
            <strong className="text-cyan-700">
              ¿Cuál es el propósito de esta aplicación?
            </strong>
            <p className="text-gray-700 mt-2">
              Esta plataforma permite a ciudadanos y equipos municipales reportar,
              gestionar y visualizar tareas y avances en tiempo real.
            </p>
          </li>
          <li className="bg-cyan-50 rounded-xl p-4 shadow">
            <strong className="text-cyan-700">¿Cómo creo una cuenta?</strong>
            <p className="text-gray-700 mt-2">
              Haz clic en "Regístrate" en la página principal y completa el
              formulario con tus datos personales y credenciales.
            </p>
          </li>
          <li className="bg-cyan-50 rounded-xl p-4 shadow">
            <strong className="text-cyan-700">
              ¿Cómo puedo recuperar mi contraseña?
            </strong>
            <p className="text-gray-700 mt-2">
              En la página de inicio de sesión, haz clic en "¿Olvidaste tu
              contraseña?" y sigue las instrucciones para restablecerla.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FAQ;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * FAQ = preguntas frecuentes
 */
