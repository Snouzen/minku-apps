export interface CurrentUser {
  id: number;
  name: string;
  role: "super_admin" | "pic";
  picName?: string;
}

export const getCurrentUser = (): CurrentUser | null => {
  if (typeof window === "undefined") return null;
  
  const userData = localStorage.getItem("currentUser");
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
};

export const logout = () => {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem("currentUser");
  window.location.href = "/login";
};

export const requireAuth = () => {
  const user = getCurrentUser();
  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }
  return user;
};
