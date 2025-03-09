import React from "react";
import { Task } from "../../api/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiMenu } from "react-icons/fi";

type TaskItemProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggle: (task: Task) => void;
  isDragging?: boolean;
};

const TaskItem = React.memo(
  ({ task, onEdit, onDelete, onToggle, isDragging }: TaskItemProps) => {
    // 使用 DnD Kit 的 `useSortable` 來讓此項目可拖曳
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: task.id });

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

    return (
      <li
        ref={setNodeRef} // 設定拖曳的參考
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.5 : 1, // 拖曳時透明度降低
          backgroundColor: isDragging ? "#FFEB3B" : "#25A0A7",
        }}
        className="grid grid-cols-[40px_30px_150px_1fr_auto] items-center gap-3 p-3 border rounded bg-[#25A0A7] shadow-md"
      >
        {/* 拖曳標誌 (可點擊此區域拖動) */}
        <span
          {...attributes} // ✅ 讓 `☰` 圖示可被 DnD Kit 辨識
          {...listeners} // ✅ 讓 `☰` 可以拖曳
          className="mr-2 text-gray-800 cursor-grab"
        >
          <FiMenu className="ml-2 w-6 h-6" />
        </span>

        {/* 勾選框：切換完成狀態 */}
        <input
          type="checkbox"
          checked={task.completed}
          className="w-4 h-4 cursor-pointer"
          onChange={(e) => {
            e.stopPropagation(); // ✅ 防止冒泡
            onToggle(task);
          }}
        />

        {/* 任務日期 */}
        <span
          className={isOverdue ? "text-red-500 font-bold" : "text-gray-600"}
        >
          📅 {task.dueDate ? task.dueDate : "未設定"}
        </span>

        {/* 文字區：完成則加刪除線 */}
        <span
          className={`flex justify-center items-center font-bold ${
            task.completed ? "line-through" : ""
          }`}
        >
          {task.title}
        </span>

        {/* 按鈕區 */}
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation(); // ✅ 防止拖曳
              onEdit(task);
            }}
            className="bg-yellow-500 text-gray-600 font-bold px-2 py-1 rounded mr-3 hover:bg-yellow-400"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // ✅ 防止拖曳
              onDelete(task.id);
            }}
            className="bg-red-600 text-gray-600 font-bold px-2 py-1 rounded hover:bg-red-400"
          >
            Delete
          </button>
        </div>
      </li>
    );
  }
);

export default TaskItem;
