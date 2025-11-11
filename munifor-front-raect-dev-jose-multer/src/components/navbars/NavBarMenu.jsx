//* ========================================
//* COMPONENTE: NavBarMenu
//* ========================================
//* Propósito: Menú desplegable de usuario (perfil + logout)
//* Usado en: CitizenNavBar, WorkerNavBar, OperatorNavBar, AdminNavBar
//* Funcionalidad:
//*   - Botón con imagen de usuario
//*   - Menú desplegable con 2 opciones:
//*     1. Ver perfil (/{profileType}/profile)
//*     2. Cerrar sesión (redirige a /login)
//* Props:
//*   - profileType: string - Tipo de perfil ("citizen", "worker", "operator", "admin")
//* Nota: usa Headless UI para componentes de menú con transiciones

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import userImage from "../../assets/img/images.png";
import { Link } from "react-router-dom";

const NavBarMenu = ({ profileType }) => {
  return (
    //* Menu: Contenedor relativo para dropdown
    <Menu as="div" className="relative ml-3">
      {/* //? Botón que abre el menú: imagen de usuario circular */}
      <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
        <span className="absolute -inset-1.5" />
        {/* //? Texto para lectores de pantalla */}
        <span className="sr-only">Open user menu</span>
        <img
          alt=""
          src={userImage}
          className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
        />
      </MenuButton>

      {/* //! MenuItems: Dropdown con transiciones de Headless UI */}
      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        {/* //? Opción 1: Ver perfil (dinámico según profileType) */}
        <MenuItem>
          <Link
            to={`/${profileType}/profile`}
            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
          >
            Your profile
          </Link>
        </MenuItem>
        {/* //! Opción 2: Cerrar sesión (redirige a login) */}
        <MenuItem>
          <Link
            to="/login"
            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
          >
            Sign out
          </Link>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};

export default NavBarMenu;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * NavBarMenu = menú de barra de navegación
 * profileType = tipo de perfil
 * Menu = menú
 * MenuButton = botón de menú
 * MenuItem = elemento de menú
 * MenuItems = elementos de menú
 * userImage = imagen de usuario
 */
