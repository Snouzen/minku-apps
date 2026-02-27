"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Pencil,
  Eye,
  Calendar,
  User,
  Filter,
} from "lucide-react";
import { format, parseISO, isBefore, subDays } from "date-fns";
import Swal from "sweetalert2";
import { getCurrentUser } from "../lib/auth";
import { DatabaseService } from "../lib/database";

type StatusType = "Open" | "Done" | "In Progress";

interface TaskPO {
  id: number;
  inputDate: string;
  task: string;
  dueDate: string;
  pic: string[];
  status: StatusType;
  remarks: string;
}

interface TaskTableRoleProps {
  userPicName?: string;
}

export default function TaskTableRole({ userPicName }: TaskTableRoleProps) {
  const [tasks, setTasks] = useState<TaskPO[]>([]);
  const [editingTask, setEditingTask] = useState<TaskPO | null>(null);
  const [viewingTask, setViewingTask] = useState<TaskPO | null>(null);
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  
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
    let filtered = tasks;
    
    if (currentUser?.role !== "super_admin") {
      filtered = tasks.filter(task => 
        task.pic.includes(userPicName || currentUser?.picName || "")
      );
    }

    if (filterText) {
      filtered = filtered.filter(
        (task) =>
          task.task.toLowerCase().includes(filterText.toLowerCase()) ||
          task.pic.some(pic => pic.toLowerCase().includes(filterText.toLowerCase()))
      );
    }

    if (filterStatus !== "All") {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }

    return filtered.sort((a, b) => new Date(b.inputDate).getTime() - new Date(a.inputDate).getTime());
  };

  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEdit = (task: TaskPO) => {
    setEditingTask({ ...task });
  };

  const handleView = (task: TaskPO) => {
    setViewingTask(task);
  };

  const handleSaveEdit = async () => {
    if (!editingTask) return;

    try {
      const updated = await DatabaseService.updateTask(editingTask.id, {
        status: editingTask.status,
        remarks: editingTask.remarks,
      });
      if (updated) {
        setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Task berhasil diperbarui!",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (e) {
      console.error("Failed to update task:", e);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal memperbarui task.",
      });
    } finally {
      setEditingTask(null);
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {currentUser?.role === "super_admin" ? "Semua Task" : `Task ${currentUser?.name}`}
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search task..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none w-full sm:w-40"
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PIC
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Remarks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {task.task}
                  </div>
                  <div className="text-xs text-gray-500">
                    Input: {format(parseISO(task.inputDate), "dd MMM yyyy")}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {task.pic.map((pic, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {pic}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    {format(parseISO(task.dueDate), "dd MMM yyyy")}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {task.remarks || "-"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleView(task)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <User size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500">Tidak ada task ditemukan</p>
        </div>
      )}

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task
                </label>
                <input
                  type="text"
                  value={editingTask.task}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editingTask.status}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      status: e.target.value as StatusType,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  value={editingTask.remarks}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      remarks: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tambahkan remarks..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingTask(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Detail Task</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task
                </label>
                <p className="text-gray-900">{viewingTask.task}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIC
                </label>
                <div className="flex flex-wrap gap-1">
                  {viewingTask.pic.map((pic, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {pic}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Input Date
                </label>
                <p className="text-gray-900">
                  {format(parseISO(viewingTask.inputDate), "dd MMM yyyy")}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <p className="text-gray-900">
                  {format(parseISO(viewingTask.dueDate), "dd MMM yyyy")}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    viewingTask.status
                  )}`}
                >
                  {viewingTask.status}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <p className="text-gray-900">
                  {viewingTask.remarks || "Tidak ada remarks"}
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => setViewingTask(null)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
