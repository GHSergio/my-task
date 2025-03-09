import axios from "axios";
import { Task } from "../api/types";

const API_URL = "/api/tasks"; // ✅ 使用 MSW 攔截的 API

// ✅ 獲取所有任務
export const fetchTasks = async (): Promise<Task[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

// ✅ 新增任務
export const addTask = async (title: string): Promise<Task[]> => {
  const response = await axios.post(API_URL, {
    title,
    completed: false,
    userId: 1,
  });
  return response.data;
};

// ✅ 更新任務
export const updateTask = async (
  id: number,
  completed: boolean
): Promise<Task[]> => {
  const response = await axios.put(`${API_URL}/${id}`, { completed });
  return response.data;
};

// ✅ 刪除任務
export const deleteTask = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
