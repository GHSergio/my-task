import { Project } from "./types";

const API_URL = "http://localhost:3001/projects";

// 獲取所有專案
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`獲取專案失敗: ${res.statusText}`);

    return res.json();
  } catch (error) {
    console.error("fetchProjects 發生錯誤:", error);
    throw error;
  }
};

// 新增專案
export const createProject = async (newProject: Project) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject), // ✅ 傳遞完整的專案資訊
    });
    console.log("新增內容是: ", newProject);
    if (!res.ok) throw new Error(`新增專案失敗: ${res.statusText}`);

    return res.json(); // 🔥 API 會回傳完整的專案物件（包含 `id`）
  } catch (error) {
    console.error("createProject 發生錯誤:", error);
    throw error;
  }
};

// 刪除專案
export const deleteProject = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`刪除專案失敗: ${res.statusText}`);
  } catch (error) {
    console.error("deleteProject 發生錯誤:", error);
    throw error;
  }
};

// 編輯專案（更新專案資訊）
export const updateProject = async ({
  id,
  updatedProject,
}: {
  id: string;
  updatedProject: Partial<Project>; // 允許部分更新
  // updatedProject: Omit<Project, "id">; // 除了 `id`，其他欄位都可更新
}) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH", // 使用 PATCH 只更新部分欄位
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProject),
    });

    if (!res.ok) throw new Error(`更新專案失敗: ${res.statusText}`);

    return res.json();
  } catch (error) {
    console.error("updateProject 發生錯誤:", error);
    throw error;
  }
};

// 根據 `projectId` 取得專案資訊
export const fetchProjectById = async (projectId: string) => {
  try {
    const res = await fetch(`${API_URL}/${projectId}`);
    if (!res.ok) throw new Error(`獲取專案失敗: ${res.statusText}`);
    return res.json();
  } catch (error) {
    console.error("fetchProjectById 發生錯誤:", error);
    throw error;
  }
};
