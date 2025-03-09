import { Project } from "../../api/types";
import { useNavigate } from "react-router-dom";

type ProjectItemProps = {
  project: Project;
  onEdit: (project: Project) => void;
  onSelectForDelete: (id: string, selected: boolean) => void;
  isSelected: boolean;
};

const ProjectItem = ({
  project,
  onEdit,
  onSelectForDelete,
  isSelected,
}: ProjectItemProps) => {
  const navigate = useNavigate();

  const isOverdue = project.dueDate && new Date(project.dueDate) < new Date();

  return (
    <li className="grid grid-cols-[50px_1fr_auto] items-center justify-around gap-4 p-2 border rounded shadow-md bg-[#2CC0C8] hover:border-4 hover:border-green">
      {/* ✅ 刪除用 Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => {
          e.stopPropagation(); // 🔥 防止 `li` 的 `onClick`
          onSelectForDelete(project.id, e.target.checked);
        }}
        className="w-4 h-4 ml-2 cursor-pointer"
      />

      <div
        onClick={() => navigate(`/tasks/${project.id}`)}
        className="grid grid-cols-3 items-center justify-center gap-4 cursor-pointer rounded"
      >
        {/* ✅ 專案名稱 */}
        <span className="font-bold">{project.name}</span>

        {/* ✅ 專案負責人名稱 */}
        <span className="font-bold">{project.owner}</span>

        {/* 任務日期 */}
        <span
          className={isOverdue ? "text-red-500 font-bold" : "text-gray-600"}
        >
          📅 {project.dueDate ? project.dueDate : "未設定"}
        </span>
      </div>

      {/* ✅ 專案簡介 */}
      {/* <span className="font-bold">{project.description}</span> */}

      {/* ✅ 編輯按鈕 */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // 🔥 防止 `li` 觸發 `onClick`
          onEdit(project);
        }}
        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-400"
      >
        編輯
      </button>
    </li>
  );
};

export default ProjectItem;
