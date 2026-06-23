"use client";

import ActivePOTable from "../component/activeTask";
import DashboardStats from "../component/dashboardStats";

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* SEKSI CARD MONITORING */}
      <DashboardStats />

      {/* SEKSI TABEL OPERASIONAL */}
      <ActivePOTable />
    </div>
  );
}
