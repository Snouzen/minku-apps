"use client";
import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertCircle,
  User2,
  Clock,
  CheckSquare,
} from "lucide-react";
import { DatabaseService } from "../lib/database";
import { getCurrentUser } from "../lib/auth";

import { TaskPO } from "../lib/database";

export default function DashboardStats() {
  const [tasks, setTasks] = useState<TaskPO[]>([]);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const loadData = async () => {
      try {
        const tasksFromDb = await DatabaseService.getTasks();
        setTasks(tasksFromDb);
      } catch (error) {
        console.error("Failed to load tasks:", error);
      }
    };

    loadData();
    const interval = setInterval(loadData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Super Admin: Lihat semua PIC
  // PIC: Lihat hanya dirinya sendiri
  const pics =
    currentUser?.role === "super_admin"
      ? ["Agung", "Latifah", "Pepy", "Pandu", "Vivi", "Rama", "Raysha"]
      : [currentUser?.picName].filter(Boolean);

  if (currentUser?.role === "super_admin") {
    // Super Admin view: Card per PIC seperti sebelumnya
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {pics
          .filter((pic): pic is string => Boolean(pic))
          .map((name) => {
            // Logic hitung: Cek apakah nama PIC ada di dalam array pic[]
            const activeTasks = tasks.filter(
              (t) =>
                t.pic.includes(name) &&
                (t.status === "Open" ||
                  t.status === "In Progress" ||
                  t.status === "Almost Expired"),
            ).length;

            const completedTasks = tasks.filter(
              (t) => t.pic.includes(name) && t.status === "Done",
            ).length;

            const hasWarning = tasks.some(
              (t) => t.pic.includes(name) && t.status === "Almost Expired",
            );
            const almostExpiredCount = tasks.filter(
              (t) => t.pic.includes(name) && t.status === "Almost Expired",
            ).length;

            return (
              <div
                key={name}
                className={`bg-white p-6 rounded-4xl border transition-all duration-300 relative overflow-hidden shadow-sm
                ${hasWarning ? "border-red-200 bg-red-50/20" : "border-gray-100 hover:border-orange-200"}`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-lg ${hasWarning ? "bg-red-100 text-red-600" : "bg-blue-50 text-[#1A237E]"}`}
                      >
                        <User2 size={14} />
                      </div>
                      <p className="text-[11px] font-black text-gray-800 uppercase tracking-widest">
                        {name}
                      </p>
                    </div>
                    {hasWarning && (
                      <div className="flex items-center gap-2">
                        <AlertCircle
                          size={16}
                          className="text-red-500 animate-pulse"
                        />
                        <span className="px-2 py-0.5 rounded-full text-2xs font-black bg-red-100 text-red-600">
                          {almostExpiredCount}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <h3
                      className={`text-4xl font-black tracking-tighter ${hasWarning ? "text-red-600" : "text-[#1A237E]"}`}
                    >
                      {activeTasks}
                    </h3>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase leading-none">
                        Task
                      </span>
                      <span className="text-[9px] font-black text-gray-400 uppercase leading-none mt-0.5">
                        Active
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-50 flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-green-500" />
                    <p className="text-2xs font-bold text-gray-500 italic">
                      <span className="text-green-600 font-black">
                        {completedTasks}
                      </span>{" "}
                      completed
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    );
  }

  // PIC view: 4 card status untuk dirinya sendiri dengan style yang sama
  const picName = pics[0] || "";
  if (!picName) return null;

  const picTasks = tasks.filter((t) => t.pic.includes(picName));

  const openCount = picTasks.filter((t) => t.status === "Open").length;
  const inProgressCount = picTasks.filter(
    (t) => t.status === "In Progress",
  ).length;
  const completedCount = picTasks.filter((t) => t.status === "Done").length;
  const almostExpiredCount = picTasks.filter(
    (t) => t.status === "Almost Expired",
  ).length;

  const getStatusCard = (
    status: string,
    count: number,
    color: string,
    icon: React.ReactNode,
  ) => (
    <div
      className={`bg-white p-6 rounded-4xl border transition-all duration-300 relative overflow-hidden shadow-sm border-gray-100 hover:border-orange-200`}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${color}`}>{icon}</div>
            <p className="text-[11px] font-black text-gray-800 uppercase tracking-widest">
              {status}
            </p>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <h3 className="text-4xl font-black tracking-tighter text-gray-800">
            {count}
          </h3>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-gray-400 uppercase leading-none">
              Task
            </span>
            <span className="text-[9px] font-black text-gray-400 uppercase leading-none mt-0.5">
              Total
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {getStatusCard(
        "Open",
        openCount,
        "bg-blue-50 text-blue-600",
        <User2 size={14} />,
      )}
      {getStatusCard(
        "In Progress",
        inProgressCount,
        "bg-orange-50 text-orange-600",
        <Clock size={14} />,
      )}
      {getStatusCard(
        "Completed",
        completedCount,
        "bg-green-50 text-green-600",
        <CheckSquare size={14} />,
      )}
      {getStatusCard(
        "Almost Expired",
        almostExpiredCount,
        "bg-red-50 text-red-600",
        <AlertCircle size={14} />,
      )}
    </div>
  );
}
