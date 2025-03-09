import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../api/projects";
import ProjectModal from "./ProjectModal";
import ProjectItem from "./ProjectItem";
import { Project } from "../../api/types";
import { useAlert } from "../../store/alert-context/AlertContext";

const ProjectList = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]); // 🔥 儲存選中的專案 ID

  // 獲取專案列表
  const {
    data: projects,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  // 新增專案
  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsModalOpen(false);
      showAlert("專案新增成功");
    },
    onError: (error) => showAlert(`新增失敗: ${error.message}`, "error"),
  });

  // 更新專案
  const updateProjectMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsModalOpen(false);
      showAlert("專案更新成功");
    },
    onError: (error) => showAlert(`更新失敗: ${error.message}`, "error"),
  });

  // 刪除專案（批量）
  const deleteProjectMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(selectedProjects.map((id) => deleteProject(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setSelectedProjects([]); // 清空選取
      showAlert("已成功刪除選取的專案");
    },
    onError: (error) => showAlert(`刪除失敗: ${error.message}`, "error"),
  });

  // 點擊「新增專案」
  const handleAddProject = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  // 點擊「編輯專案」
  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // 提交「新增/更新」
  const handleProjectSubmit = (data: Project) => {
    if (selectedProject?.id) {
      updateProjectMutation.mutate({
        id: selectedProject.id,
        updatedProject: { ...data, id: selectedProject.id },
      });
      console.log("update時: ", data);
    } else {
      createProjectMutation.mutate(data);
    }
  };

  // 處理批量選取
  const handleSelectForDelete = (id: string, selected: boolean) => {
    setSelectedProjects((prev) =>
      selected ? [...prev, id] : prev.filter((pid) => pid !== id)
    );
  };

  if (isLoading) return <p>載入中...</p>;
  if (error) return <p>發生錯誤: {error.message}</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">📌 任務列表（專案總覽）</h1>

      {/* 🔥 操作按鈕 */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={handleAddProject}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          ➕ 新增專案
        </button>

        {/* 🔥 只有選取時才顯示刪除按鈕 */}
        {selectedProjects.length > 0 && (
          <button
            onClick={() => deleteProjectMutation.mutate()}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            🗑 批量刪除 ({selectedProjects.length})
          </button>
        )}
      </div>

      {/* 🔥 專案列表 */}
      <ul className="space-y-2">
        {projects?.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            onEdit={handleEditProject}
            onSelectForDelete={handleSelectForDelete}
            isSelected={selectedProjects.includes(project.id)}
            // isSelected={
            //   project.id ? selectedProjects.includes(project.id) : false
            // }
          />
        ))}
      </ul>

      {/* 🔥 Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedProject}
        onSubmit={handleProjectSubmit}
      />
    </div>
  );
};

export default ProjectList;
