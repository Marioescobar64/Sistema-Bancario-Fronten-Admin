import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../features/auth/authStore.js";

export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, isLoadingAuth } = useAuthStore();

  if (isLoadingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Si no tiene permiso, lo enviamos al dashboard principal (cuentas) o a login si algo falla
    return <Navigate to="/dashboard/accounts" replace />;
  }

  return <Outlet />;
};
