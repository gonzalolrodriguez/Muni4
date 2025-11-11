//* ========================================
//* COMPONENTE: Footer
//* ========================================
//* Propósito: Pie de página simple para toda la aplicación
//* Usado en: Todos los layouts
//* Nota: Actualmente es un placeholder básico

const Footer = () => {
  return (
    <footer className="bg-blue-700 text-white py-4 mt-8 shadow-inner">
      <div className="container mx-auto text-center text-sm">
        &copy; {new Date().getFullYear()} MuniFor. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * Footer = pie de página
 */
