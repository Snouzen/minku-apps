"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Clock, User2 } from "lucide-react";
import { getCurrentUser } from "../lib/auth";
import { DatabaseService, TaskPO } from "../lib/database";
import { computeSLA } from "../lib/sla";

type StatusType = "Open" | "Done" | "In Progress";

interface DashboardStatsProps {
  userPicName?: string;
}

export default function DashboardStatsRole({
  userPicName,
}: DashboardStatsProps) {
  const [tasks, setTasks] = useState<TaskPO[]>([]);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await DatabaseService.getTasks();
        setTasks(data);
      } catch (e) {
        console.error("Failed to load tasks:", e);
      }
    };
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getFilteredTasks = () => {
    if (currentUser?.role === "super_admin") {
      return tasks;
    }
    return tasks.filter((task) =>
      task.pic.includes(userPicName || currentUser?.picName || ""),
    );
  };

  const filteredTasks = getFilteredTasks();

  const openTasks = filteredTasks.filter((t) => t.status === "Open").length;
  const inProgressTasks = filteredTasks.filter(
    (t) => t.status === "In Progress",
  ).length;
  const completedTasks = filteredTasks.filter(
    (t) => t.status === "Done",
  ).length;
  const almostExpiredTasks = filteredTasks.filter(
    (t) => computeSLA(t.dueDate, t.status).flag === "due_soon",
  ).length;

  const stats = [
    {
      title: "Open",
      count: openTasks,
      icon: AlertCircle,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "In Progress",
      count: inProgressTasks,
      icon: Clock,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      title: "Completed",
      count: completedTasks,
      icon: CheckCircle2,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Almost Expired",
      count: almostExpiredTasks,
      icon: AlertCircle,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-200`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${stat.textColor} mb-1`}>
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.count}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
