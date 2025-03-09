import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";
import { Project } from "../../api/types";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  onSubmit: (data: Project) => void;
}

const formatDate = (date?: string) => {
  if (!date) return ""; // 如果 date 為 undefined 或空，返回空字串
  return new Date(date).toISOString().split("T")[0];
};

const ProjectModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  project,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: project
      ? {
          id: project.id,
          name: project.name,
          description: project.description,
          owner: project.owner,
          dueDate: formatDate(project.dueDate),
        }
      : {
          id: "",
          name: "",
          description: "",
          owner: "",
          dueDate: "",
        },
  });

  // useForm defaultValues 只有在「第一次渲染時」生效，之後 project 變更時不會自動更新 -> 所以要 useEffect 輔助 變更時 reset。
  // ✅ 當 `project` 變更時，重置表單
  useEffect(() => {
    if (project) {
      reset({
        name: project.name || "",
        description: project.description || "",
        owner: project.owner || "",
        dueDate: project.dueDate
          ? new Date(project.dueDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      reset({
        name: "",
        description: "",
        owner: "",
        dueDate: "",
      });
    }
  }, [project, reset, isOpen]);

  const inputStyle = "border p-2 rounded";
  const errorStyle = "font-bold text-red-800";

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center border border-red-500">
        <div className="bg-[#25A0A7] p-3 rounded shadow-lg w-[50%]  relative">
          {/* 🚀 右上角關閉按鈕 */}
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-600 hover:text-gray-900"
          >
            <FiX size={30} />
          </button>
          <h2 className="text-2xl mb-2">{project ? "編輯專案" : "新增專案"}</h2>

          {/* 專案ID */}
          <h2>{project?.id}</h2>

          {/* 專案表單 */}
          <form
            className="flex flex-col space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              {...register("name", { required: "專案名稱必填" })}
              placeholder="輸入專案名稱"
              className={inputStyle}
            />
            {errors.name && <p className={errorStyle}>{errors.name.message}</p>}

            <input
              {...register("description")}
              placeholder="專案描述"
              className={inputStyle}
            />

            <input
              {...register("owner")}
              placeholder="負責人"
              className={inputStyle}
            />
            <input
              type="date"
              {...register("dueDate", {
                validate: (value) =>
                  new Date(value) > new Date() || "截止日期必須是未來的時間",
              })}
              className={inputStyle}
            />
            {errors.dueDate && (
              <p className={errorStyle}>{errors.dueDate.message}</p>
            )}

            {/* 按鈕 */}
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-500"
            >
              {project ? "更新專案" : "新增專案"}
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default ProjectModal;
