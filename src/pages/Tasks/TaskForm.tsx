import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";

interface TaskFormProps {
  task?: { id: number; title: string } | null;
  onSubmit: (data: { title: string }) => void; // ✅ 從 `TaskList.tsx` 傳入
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onClose }) => {
  // register("title")：把 title 欄位註冊到 React Hook Form，表單輸入會自動同步狀態。
  // handleSubmit(onSubmit)：當使用者按下提交按鈕時，執行 onSubmit 處理邏輯。
  // reset()：提交後清空表單。
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    // 先讀取快取的 `task`，否則給空值
    defaultValues: task || { title: "" },
  });

  // ✅ 表單提交後，呼叫 `onSubmit`
  const handleFormSubmit = (data: { title: string }) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="p-4 border rounded bg-[#47CFD6] shadow-md relative mb-2">
      {/* 🚀 右上角 X 按鈕 */}
      <button
        onClick={onClose}
        className="absolute top-0 right-0 text-gray-800 hover:text-red-800 transition"
        aria-label="Close form"
      >
        <FiX size={24} />
      </button>

      <h2 className="text-lg font-semibold mb-2">
        {task ? "編輯任務" : "新增任務"}
      </h2>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <input
          {...register("title", {
            required: "標題是必填的！",
            minLength: { value: 3, message: "標題至少要 3 個字" },
            maxLength: { value: 50, message: "標題不能超過 50 個字" },
          })}
          className="border p-2 w-full rounded mb-2"
          placeholder="輸入任務標題..."
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          {task ? "更新任務" : "新增任務"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
