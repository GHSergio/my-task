import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";
import { Task } from "../../api/types";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  onSubmit: (data: { title: string; dueDate: string }) => void;
}

// 將 date 轉換成 YYYY-MM-DD
const formatDate = (date?: string) => {
  if (!date) return ""; // 如果 date 為 undefined 或空，返回空字串
  return new Date(date).toISOString().split("T")[0];
};

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  task,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: task
      ? { title: task.title ?? "", dueDate: formatDate(task.dueDate) ?? "" }
      : { title: "", dueDate: "" },
  });

  // 當 `task` 變更時，重置表單，確保表單顯示正確
  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        dueDate: formatDate(task.dueDate),
      });
    } else {
      reset({ title: "", dueDate: "" });
    }
  }, [task, reset, isOpen]);

  // ✅ 表單提交
  const handleFormSubmit = (data: { title: string; dueDate?: string }) => {
    onSubmit({
      title: data.title,
      dueDate: data.dueDate ?? "",
    });
  };
  const errorStyle = "text-red-800";

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center border border-red-500">
        <div className="bg-[#2CC0C8] p-5 rounded shadow-lg w-96 relative">
          {/* 🚀 右上角關閉按鈕 */}
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-600 hover:text-gray-900"
          >
            <FiX size={26} />
          </button>

          <h2 className="text-xl font-bold mb-4">
            {task ? "編輯任務" : "新增任務"}
          </h2>

          {/* 任務表單 */}
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className=" space-y-2"
          >
            {/* 任務標題 */}
            <input
              {...register("title", {
                required: "標題是必填的！",
                minLength: { value: 3, message: "標題至少要 3 個字" },
                maxLength: { value: 50, message: "標題不能超過 50 個字" },
              })}
              className="border p-2 w-full rounded"
              placeholder="輸入任務標題..."
            />
            {errors.title && (
              <p className={errorStyle}>{errors.title.message}</p>
            )}

            {/* 日期 */}
            <input
              type="date"
              {...register("dueDate", {
                required: "截止日期是必填的！",
              })}
              className="border p-2 rounded w-full"
            />
            {errors.dueDate && (
              <p className={errorStyle}>{errors.dueDate.message}</p>
            )}

            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded w-full"
            >
              {task ? "更新任務" : "新增任務"}
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default TaskFormModal;
