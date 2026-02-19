"use client";

import { getCurrentUser } from "./lib/auth";
import ActivePOTable from "./component/activeTask";
import DashboardStats from "./component/dashboardStats";
import AuthLayout from "./auth-layout";

export default function Home() {
  const currentUser = getCurrentUser();

  return (
    <AuthLayout>
      <div className="flex flex-col gap-10 p-4">
        {/* SEKSI CARD MONITORING */}
        <DashboardStats />

        {/* SEKSI TABEL OPERASIONAL */}
        <ActivePOTable />
      </div>
    </AuthLayout>
  );
}
