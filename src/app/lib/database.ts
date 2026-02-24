import { supabase } from "./supabase";
import { format } from "date-fns";

// Database interface untuk fallback ke localStorage jika Supabase tidak bisa connect
export interface TaskPO {
  id: number;
  inputDate: string;
  task: string;
  dueDate: string;
  pic: string[];
  status: "Open" | "Done" | "In Progress" | "Almost Expired";
  remarks: string;
}

interface TaskRow {
  id: number;
  inputDate: string;
  task: string;
  dueDate: string;
  pic: string[] | null;
  status: string;
  remarks?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

// Helper functions untuk convert status ke/ dari enum di database Supabase
const statusToDb = (status: TaskPO["status"]): string => {
  switch (status) {
    case "Open":
      return "OPEN";
    case "In Progress":
      return "IN_PROGRESS";
    case "Done":
      return "DONE";
    case "Almost Expired":
      return "ALMOST_EXPIRED";
    default:
      return "OPEN";
  }
};

const statusFromDb = (status: string): TaskPO["status"] => {
  switch (status) {
    case "OPEN":
      return "Open";
    case "IN_PROGRESS":
      return "In Progress";
    case "DONE":
      return "Done";
    case "ALMOST_EXPIRED":
      return "Almost Expired";
    default:
      return "Open";
  }
};

export interface User {
  id: number;
  name: string;
  role: "super_admin" | "pic";
  picName?: string;
  password: string;
}

// Fallback ke localStorage jika database tidak available
export const getTasksFromStorage = (): TaskPO[] => {
  if (typeof window === "undefined") return [];
  const savedData = localStorage.getItem("bulog_tasks");
  return savedData ? JSON.parse(savedData) : [];
};

export const saveTasksToStorage = (tasks: TaskPO[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("bulog_tasks", JSON.stringify(tasks));
};

// Database operations dengan fallback
export class DatabaseService {
  private static isConnected = false;

  static async testConnection(): Promise<boolean> {
    try {
      if (!supabase) {
        console.warn("Supabase not configured, using localStorage");
        this.isConnected = false;
        return false;
      }
      const { error } = await supabase.from("tasks").select("id").limit(1);
      if (error) {
        console.warn("Supabase connection failed, using localStorage:", error);
        this.isConnected = false;
        return false;
      }
      this.isConnected = true;
      return true;
    } catch (error) {
      console.warn("Database connection failed, using localStorage:", error);
      this.isConnected = false;
      return false;
    }
  }

  static async getTasks(): Promise<TaskPO[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .is("deletedAt", null)
          .order("id", { ascending: true });
        if (error) throw error;
        this.isConnected = true;
        return (data || []).map((task: TaskRow) => ({
          id: task.id,
          inputDate: format(new Date(task.inputDate), "yyyy-MM-dd"),
          task: task.task,
          dueDate: format(new Date(task.dueDate), "yyyy-MM-dd"),
          pic: task.pic || [],
          status: statusFromDb(task.status),
          remarks: task.remarks || "",
        }));
      } catch (error) {
        console.warn(
          "Failed to fetch from database, falling back to localStorage:",
          error,
        );
        this.isConnected = false;
      }
    }

    return getTasksFromStorage();
  }

  static async createTask(taskData: Omit<TaskPO, "id">): Promise<TaskPO> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("tasks")
          .insert({
            task: taskData.task,
            // Simpan tanpa timezone agar tidak geser hari
            inputDate: format(new Date(), "yyyy-MM-dd"),
            dueDate: taskData.dueDate,
            pic: taskData.pic,
            status: statusToDb(taskData.status),
            remarks: taskData.remarks,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .select()
          .single();
        if (error) throw error;
        this.isConnected = true;
        return {
          id: (data as TaskRow).id,
          inputDate: format(
            new Date((data as TaskRow).inputDate),
            "yyyy-MM-dd",
          ),
          task: (data as TaskRow).task,
          dueDate: format(new Date((data as TaskRow).dueDate), "yyyy-MM-dd"),
          pic: (data as TaskRow).pic || [],
          status: statusFromDb((data as TaskRow).status),
          remarks: (data as TaskRow).remarks || "",
        };
      } catch (error) {
        console.warn(
          "Failed to create in database, falling back to localStorage:",
          error,
        );
        this.isConnected = false;
      }
    }

    // Fallback to localStorage
    const tasks = getTasksFromStorage();
    const newTask: TaskPO = {
      id: Date.now(),
      ...taskData,
    };
    tasks.push(newTask);
    saveTasksToStorage(tasks);
    return newTask;
  }

  static async updateTask(
    id: number,
    updates: Partial<TaskPO>,
  ): Promise<TaskPO | null> {
    const isLocalId = id > 2147483647;
    if (supabase && !isLocalId) {
      try {
        const payload: Partial<{
          task: string;
          dueDate: string;
          pic: string[];
          status: string;
          remarks: string | null;
          updatedAt: string;
        }> = {};
        if (updates.task !== undefined) payload.task = updates.task;
        if (updates.dueDate !== undefined) payload.dueDate = updates.dueDate;
        if (updates.pic !== undefined) payload.pic = updates.pic;
        if (updates.status !== undefined)
          payload.status = statusToDb(updates.status);
        if (updates.remarks !== undefined) payload.remarks = updates.remarks;
        payload.updatedAt = new Date().toISOString();

        const { data, error } = await supabase
          .from("tasks")
          .update(payload)
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        this.isConnected = true;
        return {
          id: (data as TaskRow).id,
          inputDate: new Date((data as TaskRow).inputDate)
            .toISOString()
            .split("T")[0],
          task: (data as TaskRow).task,
          dueDate: new Date((data as TaskRow).dueDate)
            .toISOString()
            .split("T")[0],
          pic: (data as TaskRow).pic || [],
          status: statusFromDb((data as TaskRow).status),
          remarks: (data as TaskRow).remarks || "",
        };
      } catch (error) {
        console.warn(
          "Failed to update in database, falling back to localStorage:",
          error,
        );
        this.isConnected = false;
      }
    }

    // Fallback to localStorage
    const tasks = getTasksFromStorage();
    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) return null;

    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    saveTasksToStorage(tasks);
    return tasks[taskIndex];
  }

  static async deleteTask(id: number): Promise<boolean> {
    const isLocalId = id > 2147483647;
    if (supabase && !isLocalId) {
      try {
        const { error } = await supabase
          .from("tasks")
          .update({
            deletedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .eq("id", id);
        if (error) throw error;
        this.isConnected = true;
        return true;
      } catch (error) {
        console.warn(
          "Failed to delete from database, falling back to localStorage:",
          error,
        );
        this.isConnected = false;
      }
    }

    // Fallback to localStorage
    const tasks = getTasksFromStorage();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx !== -1) {
      const [removed] = tasks.splice(idx, 1);
      const logsRaw =
        (typeof window !== "undefined" &&
          localStorage.getItem("bulog_tasks_deleted")) ||
        "[]";
      const logs = JSON.parse(logsRaw);
      logs.push({ ...removed, deletedAt: new Date().toISOString() });
      if (typeof window !== "undefined") {
        localStorage.setItem("bulog_tasks_deleted", JSON.stringify(logs));
      }
      saveTasksToStorage(tasks);
    }
    return true;
  }
}

// Initialize connection test
DatabaseService.testConnection();
