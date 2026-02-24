"use client";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { getCurrentUser } from "../lib/auth";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface DeletedTask {
  id: number;
  inputDate: string;
  task: string;
  dueDate: string;
  pic: string[];
  status: string;
  remarks?: string;
  deletedAt: string;
}

export default function LogsPage() {
  const currentUser = getCurrentUser();
  const [items, setItems] = useState<DeletedTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (supabase) {
          const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .not("deletedAt", "is", null)
            .order("deletedAt", { ascending: false });
          if (error) throw error;
          const rows = data as Array<{
            id: number;
            inputDate: string;
            task: string;
            dueDate: string;
            pic: string[] | null;
            status: string;
            remarks: string | null;
            deletedAt: string;
          }>;
          setItems(
            rows.map((t) => ({
              id: t.id,
              inputDate: t.inputDate,
              task: t.task,
              dueDate: t.dueDate,
              pic: t.pic || [],
              status: t.status,
              remarks: t.remarks || "",
              deletedAt: t.deletedAt,
            })),
          );
        } else {
          const raw =
            typeof window !== "undefined"
              ? localStorage.getItem("bulog_tasks_deleted")
              : null;
          setItems(raw ? JSON.parse(raw) : []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (!currentUser || currentUser.role !== "super_admin") {
    return (
      <div className="p-6">
        <h1 className="text-lg font-bold text-gray-800">Unauthorized</h1>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Logs - Deleted Tasks
          </h2>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
        {loading ? (
          <div className="text-gray-500 text-sm">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-gray-500 text-sm">No deleted tasks.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Deleted At</th>
                  <th className="px-4 py-3">Input Date</th>
                  <th className="px-4 py-3">Task</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">PIC</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {items.map((t) => (
                  <tr key={t.id} className="text-black">
                    <td className="px-4 py-3">{t.id}</td>
                    <td className="px-4 py-3">
                      {format(parseISO(t.deletedAt), "dd/MM/yyyy HH:mm")}
                    </td>
                    <td className="px-4 py-3">
                      {format(parseISO(t.inputDate), "dd/MM/yyyy")}
                    </td>
                    <td className="px-4 py-3">{t.task}</td>
                    <td className="px-4 py-3">
                      {format(parseISO(t.dueDate), "dd/MM/yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {t.pic.map((p) => (
                          <span
                            key={p}
                            className="bg-blue-50 text-[#1A237E] text-[10px] font-bold px-2 py-1 rounded-md border border-blue-100"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">{t.status}</td>
                    <td className="px-4 py-3">{t.remarks || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
