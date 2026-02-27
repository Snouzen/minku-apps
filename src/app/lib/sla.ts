export type SLAFlag = "none" | "ok" | "due_soon" | "overdue";

const DONE_STATUSES = new Set([
  "Done",
  "Closed",
  "Cancelled",
  "Canceled",
  "Resolved",
]);

function toDate(input: string | Date): Date {
  return input instanceof Date ? input : new Date(input);
}

function diffMs(a: Date, b: Date) {
  return a.getTime() - b.getTime();
}

export function computeSLA(
  dueDate: string | Date | null | undefined,
  status: string | null | undefined,
  now: Date = new Date(),
): {
  flag: SLAFlag;
  label: string | null;
  hoursLeft: number | null;
  daysOver: number | null;
} {
  if (!dueDate) {
    return { flag: "ok", label: null, hoursLeft: null, daysOver: null };
  }
  if (status && DONE_STATUSES.has(status)) {
    return { flag: "none", label: null, hoursLeft: null, daysOver: null };
  }
  const due = toDate(dueDate);
  const ms = diffMs(due, now);
  const oneDay = 24 * 60 * 60 * 1000;

  if (ms <= 0) {
    const daysOver = Math.ceil(Math.abs(ms) / oneDay);
    return { flag: "overdue", label: `H+${daysOver}`, hoursLeft: 0, daysOver };
  }
  if (ms <= oneDay) {
    const hoursLeft = Math.ceil(ms / (60 * 60 * 1000));
    return {
      flag: "due_soon",
      label: "Almost Expired",
      hoursLeft,
      daysOver: 0,
    };
  }
  return { flag: "ok", label: null, hoursLeft: null, daysOver: null };
}

export function isDueSoon(dueDate: string | Date, status?: string) {
  return computeSLA(dueDate, status).flag === "due_soon";
}

export function isOverdue(dueDate: string | Date, status?: string) {
  return computeSLA(dueDate, status).flag === "overdue";
}

export function slaBadgeColor(flag: SLAFlag): string {
  if (flag === "overdue") return "bg-rose-100 text-rose-700";
  if (flag === "due_soon") return "bg-amber-100 text-amber-700";
  if (flag === "ok") return "bg-emerald-100 text-emerald-700";
  return "bg-gray-100 text-gray-500";
}
