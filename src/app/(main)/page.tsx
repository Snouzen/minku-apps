"use client";

import { getCurrentUser } from "../lib/auth";
import ActivePOTable from "../component/activeTask";
import DashboardStats from "../component/dashboardStats";

export default function Home() {
  const currentUser = getCurrentUser();

  return (
    <div className="flex flex-col gap-10 p-4">
      {/* SEKSI CARD MONITORING */}
      <DashboardStats />

      {/* SEKSI TABEL OPERASIONAL */}
      <ActivePOTable />
    </div>
  );
}
