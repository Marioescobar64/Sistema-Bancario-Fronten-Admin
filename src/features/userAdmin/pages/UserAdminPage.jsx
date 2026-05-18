import { DashboardPage } from "../layouts/DashboardPage";
import { Accounts } from "../../features/userAdmin/components/Accounts";
import { Cards } from "../../features/userAdmin/components/Cards";
import { AuditLogs } from "../../features/userAdmin/components/AuditLogs";

export const UserAdminPage = () => {
    return (
        <DashboardPage>
            <div className="grid grid-cols-1 gap-4">
                <Accounts />
                <Cards />
                <AuditLogs />
            </div>
        </DashboardPage>
    );
};
