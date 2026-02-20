"use client";
import React, { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  Search,
  X,
  Calendar,
  Pencil,
  Eye,
  User,
  FileText,
  Info,
  AlertCircle,
} from "lucide-react";
import {
  format,
  parseISO,
  subDays,
  isSameDay,
  isBefore,
  getMonth,
} from "date-fns";
import Swal from "sweetalert2";
import { getCurrentUser } from "../lib/auth";
import { DatabaseService, TaskPO } from "../lib/database";

type StatusType = "Open" | "Done" | "In Progress" | "Almost Expired";

export default function ActivePOTable() {
  const [tasks, setTasks] = useState<TaskPO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskPO | null>(null);
  const [viewingTask, setViewingTask] = useState<TaskPO | null>(null);

  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterMonth, setFilterMonth] = useState("All"); // New State Month
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [formData, setFormData] = useState({
    task: "",
    dueDate: "",
    pic: [] as string[],
    remarks: "",
  });

  const picList = ["Agung", "Latifah", "Pepy", "Pandu", "Fifi", "Rama"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasksFromDb = await DatabaseService.getTasks();
        setTasks(tasksFromDb);
      } catch (error) {
        console.error("Failed to load tasks:", error);
      }
    };

    loadTasks();
  }, []);

  useEffect(() => {
    const updateExpiredTasks = async () => {
      const today = new Date();
      const updatedTasks = tasks.map((t) => {
        const due = parseISO(t.dueDate);
        const hMinus1 = subDays(due, 1);
        if (
          (isSameDay(today, hMinus1) || isBefore(due, today)) &&
          t.status !== "Done"
        ) {
          return { ...t, status: "Almost Expired" as StatusType };
        }
        return t;
      });

      // Update expired tasks in database
      for (const task of updatedTasks) {
        if (task.status === "Almost Expired") {
          await DatabaseService.updateTask(task.id, { status: task.status });
        }
      }

      if (JSON.stringify(updatedTasks) !== JSON.stringify(tasks)) {
        setTasks(updatedTasks);
      }
    };

    updateExpiredTasks();
  }, [tasks]);

  const handleSelectPIC = (name: string) => {
    setFormData((prev) => {
      if (prev.pic.includes(name))
        return { ...prev, pic: prev.pic.filter((p) => p !== name) };
      if (prev.pic.length < 2) return { ...prev, pic: [...prev.pic, name] };
      Swal.fire({
        icon: "info",
        title: "Maksimal 2 PIC",
        confirmButtonColor: "#1A237E",
      });
      return prev;
    });
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTask) {
        // Update existing task
        const updates: Partial<TaskPO> = {
          remarks: formData.remarks,
          // Super admin bisa update semua field, PIC hanya status & remarks
          ...(currentUser?.role === "super_admin" && {
            task: formData.task,
            dueDate: formData.dueDate,
            pic: formData.pic,
          }),
          // PIC bisa update status
          ...(currentUser?.role === "pic" && {
            status: editingTask.status, // Gunakan status dari editingTask yang sudah diupdate
          }),
        };

        const updatedTask = await DatabaseService.updateTask(
          editingTask.id,
          updates,
        );
        if (updatedTask) {
          setTasks(
            tasks.map((t) => (t.id === editingTask.id ? updatedTask : t)),
          );
        }
      } else {
        // Add new task - hanya super admin yang bisa
        if (currentUser?.role !== "super_admin") {
          Swal.fire(
            "Error",
            "Hanya Super Admin yang bisa menambah task",
            "error",
          );
          return;
        }
        if (formData.pic.length === 0)
          return Swal.fire("Error", "Pilih minimal 1 PIC", "error");

        const newTaskData: Omit<TaskPO, "id"> = {
          inputDate: new Date().toISOString().split("T")[0],
          ...formData,
          status: "Open",
        };

        const newTask = await DatabaseService.createTask(newTaskData);
        setTasks([...tasks, newTask]);
      }

      setIsModalOpen(false);
      setEditingTask(null);
      setFormData({ task: "", dueDate: "", pic: [], remarks: "" });

      Swal.fire({
        icon: "success",
        title: "Data Saved!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error saving task:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Gagal menyimpan task. Silakan coba lagi.",
      });
    }
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "Hapus Data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A237E",
      confirmButtonText: "Ya, Hapus!",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const success = await DatabaseService.deleteTask(id);
          if (success) {
            setTasks(tasks.filter((t) => t.id !== id));
            Swal.fire({
              icon: "success",
              title: "Terhapus!",
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            throw new Error("Failed to delete task");
          }
        } catch (error) {
          console.error("Error deleting task:", error);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Gagal menghapus task. Silakan coba lagi.",
          });
        }
      }
    });
  };

  const currentUser = getCurrentUser();

  const filteredTasks = tasks.filter((t) => {
    // Role-based filter: PIC hanya lihat task mereka
    const matchesRole =
      currentUser?.role === "super_admin" ||
      t.pic.includes(currentUser?.picName || "");

    const matchesText =
      t.task.toLowerCase().includes(filterText.toLowerCase()) ||
      t.pic.some((p) => p.toLowerCase().includes(filterText.toLowerCase()));
    const matchesStatus = filterStatus === "All" || t.status === filterStatus;

    // Filter Month Logic based on inputDate
    const taskMonth = getMonth(parseISO(t.inputDate)).toString();
    const matchesMonth = filterMonth === "All" || taskMonth === filterMonth;

    return matchesRole && matchesText && matchesStatus && matchesMonth;
  });
  useEffect(() => {
    setCurrentPage(1);
  }, [filterText, filterStatus, filterMonth, tasks]);
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize));
  const pageTasks = filteredTasks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="space-y-6">
      {/* FILTER BAR */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search task or PIC..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl outline-none text-sm text-black"
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>

          {/* FILTER MONTH (NEW) */}
          <select
            className="bg-gray-50 px-4 py-2 rounded-xl text-sm outline-none border-none cursor-pointer text-black min-w-[120px]"
            onChange={(e) => setFilterMonth(e.target.value)}
          >
            <option value="All">All Months</option>
            {months.map((m, idx) => (
              <option key={m} value={idx.toString()}>
                {m}
              </option>
            ))}
          </select>

          <select
            className="bg-gray-50 px-4 py-2 rounded-xl text-sm outline-none border-none cursor-pointer text-black"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
            <option value="Almost Expired">Almost Expired</option>
          </select>
        </div>
        {currentUser?.role === "super_admin" && (
          <button
            onClick={() => {
              setEditingTask(null);
              setFormData({ task: "", dueDate: "", pic: [], remarks: "" });
              setIsModalOpen(true);
            }}
            className="w-full lg:w-auto bg-[#1A237E] text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-900 transition-all shadow-md"
          >
            <Plus size={18} /> Add New Task
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-50">
              <tr>
                <th className="px-6 py-5 w-16 text-center">No</th>
                <th className="px-6 py-5">Input Date</th>
                <th className="px-6 py-5 min-w-32 max-w-xs">
                  Task Description
                </th>
                <th className="px-6 py-5">Due Date</th>
                <th className="px-6 py-5">PIC Assign</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pageTasks.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/30 group transition-colors text-black"
                >
                  <td className="px-6 py-5 text-gray-400 text-center font-medium">
                    {index + 1}
                  </td>
                  <td className="px-6 py-5 text-gray-500 text-xs">
                    {format(parseISO(item.inputDate), "dd/MM/yyyy")}
                  </td>
                  <td className="px-6 py-5 font-bold text-gray-700 max-w-xs">
                    <div className="wrap-break-word overflow-wrap">
                      {item.task}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-gray-600 font-medium text-xs">
                    {format(parseISO(item.dueDate), "dd MMM yyyy")}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1">
                      {item.pic.map((p) => (
                        <span
                          key={p}
                          className="bg-blue-50 text-[#1A237E] text-[10px] font-bold px-2 py-1 rounded-md border border-blue-100"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.status === "Done" ? "bg-green-100 text-green-600" : item.status === "Almost Expired" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-start gap-1  group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => setViewingTask(item)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingTask(item);
                          setFormData({
                            task: item.task,
                            dueDate: item.dueDate,
                            pic: item.pic,
                            remarks: item.remarks,
                          });
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg"
                      >
                        <Pencil size={16} />
                      </button>
                      {currentUser?.role === "super_admin" && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-gray-100">
        <span className="text-xs text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-xl text-xs font-bold border ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 border-gray-100"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-xl text-xs font-bold border ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 border-gray-100"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* MODAL VIEW */}
      {viewingTask && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#1A237E]/20 backdrop-blur-md"
            onClick={() => setViewingTask(null)}
          />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-200 border border-white">
            <div className="p-6 bg-[#1A237E] text-white flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200">
                  Task Information
                </p>
                <button
                  onClick={() => setViewingTask(null)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <h3 className="text-xl font-black uppercase italic tracking-tight mt-2">
                {viewingTask.task}
              </h3>
            </div>
            <div className="p-8 space-y-6 text-black">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    PIC Assigned
                  </label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {viewingTask.pic.map((p) => (
                      <span
                        key={p}
                        className="px-3 py-1 bg-blue-50 text-[#1A237E] rounded-lg font-bold text-[10px] border border-blue-100"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Due Date
                  </label>
                  <p className="text-sm font-bold text-gray-700 mt-2 flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    {format(parseISO(viewingTask.dueDate), "dd MMM yyyy")}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Operation Status
                </label>
                <div className="mt-2">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${viewingTask.status === "Done" ? "bg-green-100 text-green-600" : viewingTask.status === "Almost Expired" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}
                  >
                    {viewingTask.status}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Remarks Log
                </label>
                <div className="mt-2 p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
                  <div className="max-h-60 overflow-y-auto text-sm text-gray-600 italic leading-relaxed whitespace-pre-wrap pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {viewingTask.remarks || "No additional remarks recorded."}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewingTask(null)}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all active:scale-95"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INPUT/EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 bg-[#1A237E] text-white flex justify-between items-center">
              <h3 className="font-black uppercase tracking-tight">
                {editingTask ? "Update Task" : "Add New Task"}
              </h3>
              <X
                className="cursor-pointer hover:rotate-90 transition-all"
                onClick={() => setIsModalOpen(false)}
              />
            </div>
            <form
              onSubmit={handleSaveTask}
              className="p-8 space-y-5 text-black"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Task Description
                </label>
                <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
                  <input
                    required
                    type="text"
                    placeholder="Enter task name..."
                    className={`min-w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 focus:border-blue-200 transition-all text-black text-sm font-medium ${currentUser?.role === "pic" ? "bg-gray-100 text-gray-500" : ""}`}
                    value={formData.task}
                    onChange={(e) =>
                      currentUser?.role === "super_admin" &&
                      setFormData({ ...formData, task: e.target.value })
                    }
                    disabled={currentUser?.role === "pic"}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Due Date
                </label>
                <input
                  required
                  type="date"
                  className={`w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 focus:border-blue-200 transition-all text-sm font-medium ${currentUser?.role === "pic" ? "bg-gray-100 text-gray-500" : ""}`}
                  value={formData.dueDate}
                  onChange={(e) =>
                    currentUser?.role === "super_admin" &&
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  disabled={currentUser?.role === "pic"}
                />
              </div>
              {currentUser?.role === "super_admin" && (
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3 block">
                    Assign PIC (Max 2)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {picList.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => handleSelectPIC(name)}
                        className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border ${formData.pic.includes(name) ? "bg-[#1A237E] text-white border-[#1A237E] shadow-md" : "bg-gray-50 text-gray-400 border-gray-100 hover:border-blue-100"}`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {currentUser?.role === "pic" && (
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3 block">
                    Current PIC
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.pic.map((name) => (
                      <span
                        key={name}
                        className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase bg-gray-100 text-gray-600 border border-gray-200"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {currentUser?.role === "pic" && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Status
                  </label>
                  <select
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 focus:border-blue-200 transition-all text-sm font-medium"
                    value={editingTask ? editingTask.status : "Open"}
                    onChange={(e) =>
                      editingTask &&
                      setEditingTask({
                        ...editingTask,
                        status: e.target.value as StatusType,
                      })
                    }
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Additional Remarks
                </label>
                <textarea
                  placeholder="Write remarks here..."
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 focus:border-blue-200 transition-all text-sm font-medium resize-y"
                  rows={4}
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg hover:bg-orange-600 transition-all active:scale-95 mt-4 text-xs"
              >
                {editingTask ? "Update Operation" : "Save and Deploy"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
