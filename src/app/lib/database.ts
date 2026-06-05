import { format } from "date-fns";
import { getTasksAction, createTaskAction, updateTaskAction, deleteTaskAction } from "../actions/tasks";

export interface TaskPO {
  id: number;
  inputDate: string;
  task: string;
  dueDate: string;
  pic: string[];
  status: "Open" | "Done" | "In Progress";
  remarks: string;
}

const statusToDb = (status: TaskPO["status"]): string => {
  switch (status) {
    case "Open": return "OPEN";
    case "In Progress": return "IN_PROGRESS";
    case "Done": return "DONE";
    default: return "OPEN";
  }
};

const statusFromDb = (status: string): TaskPO["status"] => {
  switch (status) {
    case "OPEN": return "Open";
    case "IN_PROGRESS": return "In Progress";
    case "DONE": return "Done";
    case "ALMOST_EXPIRED": return "In Progress";
    default: return "Open";
  }
};

export interface User {
  id: number;
  name: string;
  role: "SUPER_ADMIN" | "PIC";
  picName?: string;
  password: string;
}

export const getTasksFromStorage = (): TaskPO[] => {
  if (typeof window === "undefined") return [];
  const savedData = localStorage.getItem("bulog_tasks");
  return savedData ? JSON.parse(savedData) : [];
};

export const saveTasksToStorage = (tasks: TaskPO[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("bulog_tasks", JSON.stringify(tasks));
};

export class DatabaseService {
  private static isConnected = true;

  static async testConnection(): Promise<boolean> {
    return true; // Assume always true since we rely on Server Actions
  }

  static async getTasks(): Promise<TaskPO[]> {
    try {
      const result = await getTasksAction();
      if (result.success && result.tasks) {
        return result.tasks.map((task: any) => ({
          id: task.id,
          inputDate: format(new Date(task.inputDate), "yyyy-MM-dd"),
          task: task.task,
          dueDate: format(new Date(task.dueDate), "yyyy-MM-dd"),
          pic: task.pic || [],
          status: statusFromDb(task.status),
          remarks: task.remarks || "",
        }));
      }
    } catch (error) {
      console.warn("Failed to fetch from server actions, falling back to localStorage:", error);
    }
    return getTasksFromStorage();
  }

  static async createTask(taskData: Omit<TaskPO, "id">): Promise<TaskPO> {
    try {
      const payload = {
        task: taskData.task,
        dueDate: taskData.dueDate,
        pic: taskData.pic,
        status: statusToDb(taskData.status),
        remarks: taskData.remarks,
      };
      
      const result = await createTaskAction(payload);
      if (result.success && result.task) {
        return {
          id: result.task.id,
          inputDate: format(new Date(result.task.inputDate), "yyyy-MM-dd"),
          task: result.task.task,
          dueDate: format(new Date(result.task.dueDate), "yyyy-MM-dd"),
          pic: result.task.pic || [],
          status: statusFromDb(result.task.status),
          remarks: result.task.remarks || "",
        };
      }
    } catch (error) {
      console.warn("Failed to create via server action, falling back to localStorage:", error);
    }

    const tasks = getTasksFromStorage();
    const newTask: TaskPO = { id: Date.now(), ...taskData };
    tasks.push(newTask);
    saveTasksToStorage(tasks);
    return newTask;
  }

  static async updateTask(id: number, updates: Partial<TaskPO>): Promise<TaskPO | null> {
    const isLocalId = id > 2147483647;
    if (!isLocalId) {
      try {
        const payload: any = {};
        if (updates.task !== undefined) payload.task = updates.task;
        if (updates.dueDate !== undefined) payload.dueDate = updates.dueDate;
        if (updates.pic !== undefined) payload.pic = updates.pic;
        if (updates.status !== undefined) payload.status = statusToDb(updates.status);
        if (updates.remarks !== undefined) payload.remarks = updates.remarks;

        const result = await updateTaskAction(id, payload);
        if (result.success && result.task) {
          return {
            id: result.task.id,
            inputDate: format(new Date(result.task.inputDate), "yyyy-MM-dd"),
            task: result.task.task,
            dueDate: format(new Date(result.task.dueDate), "yyyy-MM-dd"),
            pic: result.task.pic || [],
            status: statusFromDb(result.task.status),
            remarks: result.task.remarks || "",
          };
        }
      } catch (error) {
        console.warn("Failed to update via server action, falling back to localStorage:", error);
      }
    }

    const tasks = getTasksFromStorage();
    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) return null;

    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    saveTasksToStorage(tasks);
    return tasks[taskIndex];
  }

  static async deleteTask(id: number): Promise<boolean> {
    const isLocalId = id > 2147483647;
    if (!isLocalId) {
      try {
        const result = await deleteTaskAction(id);
        if (result.success) return true;
      } catch (error) {
        console.warn("Failed to delete via server action, falling back to localStorage:", error);
      }
    }

    const tasks = getTasksFromStorage();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx !== -1) {
      const [removed] = tasks.splice(idx, 1);
      const logsRaw = (typeof window !== "undefined" && localStorage.getItem("bulog_tasks_deleted")) || "[]";
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
