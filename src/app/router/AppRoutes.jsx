
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "../../features/auth/pages/AuthPage";
import { VerifyEmailPage } from "../../features/auth/pages/VerifyEmailPage";
import { DashboardPage } from "../layouts/DashboardPage";
import { Accounts } from "../../features/accounts/components/Accounts.jsx";
import { Cards } from "../../features/cards/components/Cards.jsx";
import { Transfers } from "../../features/transfers/components/Transfers.jsx";
import { Loans } from "../../features/loans/components/Loans.jsx";
import { Users } from "../../features/users/components/Users.jsx";
import { AuditLogs } from "../../features/auditLogs/components/AuditLogs.jsx";
import { SuspiciousMovements } from "../../features/suspiciousMovement/components/SuspiciousMovements.jsx";
import { Services } from "../../features/services/components/Services.jsx";
import { Statements } from "../../features/accounts/components/Statements.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { useAuthStore } from "../../features/auth/authStore.js";

const ADMIN_ROLES = ["SUPER_ADMIN_ROLE", "ADMIN_ROLE"];
const STAFF_ROLES = ["SUPER_ADMIN_ROLE", "ADMIN_ROLE", "CAJERO_ROLE"];

export const AppRoutes = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/dashboard/accounts" replace /> : <AuthPage />
      } />
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      {/* PROTECTED + ROLE */}
      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route element={<DashboardPage />}>
          {/* Rutas STAFF */}
          <Route element={<ProtectedRoute allowedRoles={STAFF_ROLES} />}>
            <Route path="accounts" element={<Accounts />} />
            <Route path="cards" element={<Cards />} />
            <Route path="transfers" element={<Transfers />} />
            <Route path="loans" element={<Loans />} />
            <Route path="services" element={<Services />} />
            <Route path="statements" element={<Statements />} />
          </Route>

          {/* Rutas ADMIN */}
          <Route element={<ProtectedRoute allowedRoles={ADMIN_ROLES} />}>
            <Route path="users" element={<Users />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="suspicious-movements" element={<SuspiciousMovements />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
    </Routes>
  );
};