import { useOutletContext } from 'react-router-dom';

/**
 * Hook simplificado para acceder al estado de darkMode
 * Retorna true si está activo el modo oscuro
 */
export const useDarkMode = () => {
  const { darkMode = false } = useOutletContext() ?? {};
  return darkMode;
};
