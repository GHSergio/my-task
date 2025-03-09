import { Task } from "./types";

const API_URL = "http://localhost:3001";

// ✅ 獲取所有任務 (GET)
export const fetchTasks = async (projectId: string, pageParam = 1) => {
  if (!projectId) {
    throw new Error("projectId 未定義，無法獲取任務！");
  }

  try {
    // const res = await fetch(
    //   `${API_URL}?_page=${pageParam}&_limit=10&_sort=id&_order=asc`
    // );

    const res = await fetch(
      `${API_URL}/tasks?projectId=${projectId}&_page=${pageParam}&_limit=10&_sort=order&_order=asc`
    );

    if (!res.ok) {
      throw new Error(`無法獲取任務: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // 🔥 取得 `X-Total-Count` 來正確計算 `nextPage`
    const totalCount = res.headers.get("X-Total-Count");

    const nextPage =
      totalCount && pageParam * 10 < Number(totalCount)
        ? pageParam + 1
        : undefined;

    return { tasks: data, nextPage };
  } catch (error) {
    console.error("fetchTasks 發生錯誤:", error);
    throw error;
  }
};

// 刪除任務 (DELETE)
export const deleteTask = async ({ id }: { id: number }) => {
  try {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error(`刪除任務失敗: ${res.statusText}`);
  } catch (error) {
    console.error("deleteTask 發生錯誤:", error);
    throw error;
  }
};

// 切換任務完成狀態 (PATCH)
export const toggleTaskCompletion = async ({
  id,
  completed,
}: {
  id: number;
  completed: boolean;
}) => {
  try {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });

    if (!res.ok) {
      throw new Error(`切換任務狀態失敗 (id: ${id})`);
    }
    return res.json();
  } catch (error) {
    console.error("toggleTaskCompletion 發生錯誤:", error);
    throw error;
  }
};

// 創建新任務 (POST)
export const createTask = async (newTask: {
  projectId: string;
  title: string;
  dueDate: string;
}) => {
  try {
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newTask, completed: false }),
    });

    if (!res.ok) throw new Error(`新增任務失敗: ${res.statusText}`);

    return res.json();
  } catch (error) {
    console.error("createTask 發生錯誤:", error);
    throw error;
  }
};

// 更新任務 (PATCH)
export const updateTask = async ({
  id,
  updatedTask,
}: {
  id: number;
  updatedTask: { title: string; dueDate: string };
}) => {
  try {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });

    if (!res.ok) {
      throw new Error(`更新任務失敗 (id: ${id})`);
    }

    return res.json();
  } catch (error) {
    console.error("updateTask 發生錯誤:", error);
    throw error;
  }
};

// 更換排序
export const updateTaskOrder = async (tasks: Task[]) => {
  try {
    // ✅ 建立所有 `PATCH` 請求，更新每個 Task 的 `order`
    const updateRequests = tasks.map((task, index) =>
      fetch(`${API_URL}/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order: index }), // ✅ 更新 `order` 屬性
      })
    );

    // ✅ 等待所有 `PATCH` 請求完成
    await Promise.all(updateRequests);
    console.log("任務順序已成功更新至後端！");

    return { success: true };
  } catch (error) {
    console.error("更新任務順序失敗:", error);
    throw new Error("更新任務順序失敗，請檢查 API 是否正常運行！");
  }
};
