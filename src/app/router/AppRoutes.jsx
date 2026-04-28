import { Routes, Route } from "react-router-dom";
import { AuthPage } from "../../features/auth/pages/AuthPage";
import { DashboardPage } from "../layouts/DashboardPage";
import { Accounts } from "../../features/accounts/components/Accounts.jsx";
import { Cards } from "../../features/cards/components/Cards.jsx";
import { Transfers } from "../../features/transfers/components/Transfers.jsx";
import { Loans } from "../../features/loans/components/Loans.jsx";
import { Users } from "../../features/users/components/Users.jsx";
import { AuditLogs } from "../../features/auditLogs/components/AuditLogs.jsx";
import { SuspiciousMovements } from "../../features/suspiciousMovement/components/SuspiciousMovements.jsx";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<AuthPage />} />

      {/* PROTECTED + ROLE */}
      <Route path="/dashboard/*" element={<DashboardPage />}>
        <Route path="accounts" element={<Accounts />} />
        <Route path="cards" element={<Cards />} />
        <Route path="transfers" element={<Transfers />} />
        <Route path="loans" element={<Loans />} />
        <Route path="users" element={<Users />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="suspicious-movements" element={<SuspiciousMovements />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
    </Routes>
  );
};