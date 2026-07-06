import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/authStore.js';
import defaultAvatarImg from '../../assets/img/avatarDefault.png';

export const AvatarUser = () => {
  const { user, logout } = useAuthStore();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Abrir/cerrar menú
  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const avatarSrc =
    user?.profilePicture && user.profilePicture.trim() !== ''
      ? user.profilePicture
      : defaultAvatarImg;

  return (
    <div className="relative" ref={dropdownRef}>
      <img
        onClick={toggleMenu}
        src={avatarSrc}
        alt={user?.username || 'Avatar'}
        className="w-10 h-10 rounded-full object-cover border cursor-pointer"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = defaultAvatarImg;
        }}
      />

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#112B3C] border border-gray-200 dark:border-[#1B4F72] rounded-lg shadow-lg animate-fadeIn z-50">
          <div className="px-4 py-3 border-b dark:border-[#1B4F72]">
            <p className="font-semibold text-gray-800 dark:text-[#EAF2F8]">
              {user?.username}
            </p>
            <p className="text-sm text-gray-500 dark:text-[#A9CCE3] truncate">
              {user?.email}
            </p>
          </div>

          <ul className="p-2 text-sm text-gray-700 dark:text-[#EAF2F8] font-medium">
            <li>
              <Link
                to="/dashboard/accounts"
                className="block w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#1B4F72]"
              >
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/dashboard/users"
                className="block w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#1B4F72]"
              >
                Usuarios
              </Link>
            </li>

            <li>
              <button
                onClick={handleLogout}
                className="block w-full text-left p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
              >
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
