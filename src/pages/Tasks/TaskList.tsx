import { useState, useEffect, useCallback, useMemo } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import TaskModal from "./TaskModal";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { motion } from "framer-motion";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import TaskItem from "./TaskItem";
import { Task } from "../../api/types";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  updateTaskOrder,
} from "../../api/tasks";
import { fetchProjectById } from "../../api/projects";
import { useAlert } from "../../store/alert-context/AlertContext";
import { useParams } from "react-router-dom";

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateSort, setDateSort] = useState("default"); // 照狀態篩選
  const queryClient = useQueryClient(); // 日期排序
  const { showAlert } = useAlert();
  const { projectId } = useParams<{ projectId: string }>();

  // 🔥 根據 `projectId` 獲取專案名稱
  const { data: project, error: projectError } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProjectById(projectId!),
    enabled: !!projectId, // 只有 `projectId` 存在時才執行
  });

  // 改用 useInfiniteQuery 來實現無限滾動
  const { data, fetchNextPage, hasNextPage, error } = useInfiniteQuery({
    queryKey: ["tasks", projectId], // 依 projectId 區分
    queryFn: ({ pageParam = 1 }) => fetchTasks(projectId!, pageParam),
    enabled: !!projectId, // 只有 projectId 存在時才執行
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.nextPage) return undefined;

      // 確保每次請求的新數據沒有重複
      const allIds = allPages.flatMap((page) =>
        page.tasks.map((task: Task) => task.id)
      );
      const uniqueIds = new Set(allIds);
      if (allIds.length !== uniqueIds.size) {
        console.warn("⚠️ 檢測到重複的 ID，請檢查 API 返回的數據", allIds);
      }

      return lastPage.nextPage;
    },
  });

  // 獲取data setTask
  useEffect(() => {
    if (data && data.pages) {
      setTasks((prevTasks) => {
        const newTasks = data.pages.flatMap((page) => page.tasks || []);
        return JSON.stringify(prevTasks) === JSON.stringify(newTasks)
          ? prevTasks
          : newTasks;
      });
    }
  }, [data]);

  // 每次組件渲染時都會重新執行 useMutation()，從而返回新的 mutation 物件。
  // 新增任務
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      closeModal();
      showAlert("任務新增成功");
    },
    onError: (error) => {
      showAlert(` ${error.message}`, "error");
    },
  });

  // 更新任務
  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      closeModal();
      showAlert("任務更新成功");
    },
    onError: (error) => {
      showAlert(` ${error.message}`, "error");
    },
  });

  // 刪除任務
  const deleteTaskMutation = useMutation({
    // mutationFn: (id: number) => deleteTask(id),
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showAlert("任務刪除成功");
    },
    onError: (error) => {
      showAlert(`刪除失敗: ${error.message}`, "error");
    },
  });

  // 切換任務完成狀態
  const toggleTaskCompletionMutation = useMutation({
    mutationFn: toggleTaskCompletion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    onError: (error) => {
      showAlert(` ${error.message}`, "error");
    },
  });

  // 開啟 Modal（新增 或 編輯）
  const openModal = useCallback((task?: Task) => {
    setSelectedTask(task ?? null);
    setIsModalOpen(true);
  }, []);

  // 關閉 Modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTask(null);
  }, []);

  // 統一處理「新增 & 更新」的提交邏輯
  const handleSubmit = (data: { title: string; dueDate: string }) => {
    if (selectedTask) {
      updateTaskMutation.mutate({
        id: selectedTask.id,
        updatedTask: { title: data.title, dueDate: data.dueDate || "" },
      });
    } else {
      createTaskMutation.mutate({
        projectId: projectId as string,
        title: data.title,
        dueDate: data.dueDate ?? "",
      });
    }
  };

  // 拖曳結束時，更新狀態
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((task) => task.id === active.id);
    const newIndex = tasks.findIndex((task) => task.id === over.id);

    const newTasks = arrayMove(tasks, oldIndex, newIndex); // 本地更新
    setTasks(newTasks);

    try {
      await updateTaskOrder(newTasks); // 調用 API 更新後端順序
      console.log("伺服器已更新任務順序！");
    } catch (error) {
      console.error("更新任務順序失敗", error);
    }
  };

  // 篩選後的任務
  const filteredTasks = useMemo(() => {
    return [...tasks]
      .filter((task) => {
        // 1. 狀態篩選
        return (
          statusFilter === "all" ||
          (statusFilter === "completed" && task.completed) ||
          (statusFilter === "incomplete" && !task.completed)
        );
      })
      .filter((task) => {
        // 2. 搜尋任務標題
        return task.title.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => {
        // 3. 日期排序
        if (dateSort === "default") return 0; // 預設不改變順序
        if (!a.dueDate) return 1; // 沒有截止日期的排後面
        if (!b.dueDate) return -1;
        return dateSort === "asc"
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime() // 由近到遠
          : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(); // 由遠到近
      });
  }, [tasks, statusFilter, dateSort, searchQuery]);

  if (error) return <p>發生錯誤</p>;
  if (projectError) return <p>獲取專案資訊失敗</p>;

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-2">
          📂 {project ? project.name : "載入中..."}{" "}
        </h1>

        {/* 搜尋列 */}
        <input
          type="text"
          placeholder="🔍 搜尋任務..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block border p-2 rounded w-full mb-4"
        />

        <div className="flex justify-between mb-4">
          {/* 新增按鈕 */}
          <button
            onClick={() => openModal()}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            + 新增任務
          </button>

          {/* 篩選select */}
          <div className="flex space-x-4 mb-4">
            {/* 狀態篩選 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="all">全部</option>
              <option value="completed">已完成</option>
              <option value="incomplete">未完成</option>
            </select>

            {/* 日期排序 */}
            <select
              value={dateSort}
              onChange={(e) => setDateSort(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="default">預設排序</option>
              <option value="asc">由近到遠</option>
              <option value="desc">由遠到近</option>
            </select>
          </div>
        </div>

        {/* Modal（控制顯示/隱藏） */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          task={selectedTask}
        />
      </div>

      {/* 確保有足夠高度可滾動 */}
      <div id="scroll-container" className="h-[80vh] overflow-auto">
        {/* 拖曳排序的容器 */}
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={(event) => {
            const draggedTask = tasks.find(
              (task) => task.id === event.active.id
            );
            setActiveTask(draggedTask || null);
          }}
          onDragEnd={(event) => {
            setActiveTask(null); // 拖曳結束時清除
            handleDragEnd(event);
          }}
        >
          <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
            <ul className="space-y-2">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isDragging={activeTask?.id === task.id}
                  onEdit={() => {
                    openModal(task);
                  }}
                  onDelete={() => deleteTaskMutation.mutate({ id: task.id })}
                  onToggle={() => toggleTaskCompletionMutation.mutate(task)}
                />
              ))}
            </ul>
          </SortableContext>

          {/* 拖曳時的 Overlay（確保拖曳時的項目可見） */}
          <DragOverlay>
            {activeTask ? (
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1, opacity: 0.8 }}
                transition={{ duration: 0.2 }}
                className="p-3 border bg-gray-200 shadow-lg"
              >
                {activeTask.title}
              </motion.div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* 手動加載更多 */}
        {hasNextPage && (
          <button
            onClick={() => {
              fetchNextPage();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4"
          >
            加載更多
          </button>
        )}
      </div>
    </>
  );
};

export default TaskList;
