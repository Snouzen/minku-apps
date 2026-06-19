"use client";

import ActivePOTable from "../component/activeTask";
import DashboardStats from "../component/dashboardStats";

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
        </div>
      </div>

      {/* SEKSI CARD MONITORING */}
      <DashboardStats />

      {/* SEKSI TABEL OPERASIONAL */}
      <ActivePOTable />
    </div>
  );
}
