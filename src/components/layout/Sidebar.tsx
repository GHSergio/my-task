import { NavLink, useParams, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiList,
  FiSettings,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "../../api/projects";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { projectId } = useParams(); // 取得當前的專案 ID

  // 🚀 取得專案列表
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  if (error) return <p className="text-red-500">❌ 無法載入專案列表</p>;

  const navItemStyle =
    "flex items-center rounded-lg transition hover:bg-gray-400";
  const spanStyle = "font-bold";
  const iconStyle = "mr-2";

  // 統一 NavLink 樣式
  const getNavItemClasses = (isActive: boolean) =>
    `${navItemStyle} ${isActive ? "bg-gray-600" : ""} ${
      isOpen ? "p-3" : "p-0"
    }`;

  return (
    <>
      {/* 📌 Sidebar (使用 transform 控制展開/收起) */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? "w-64 p-4" : "w-0 p-1"
        }`}
      >
        {/* 📌 抽屜把手 */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          title={isOpen ? "收起" : "展開"}
          className="absolute top-1/2 left-[100%] -translate-y-1/2 bg-blue-500 w-5 h-20 text-white rounded-r-lg cursor-pointer shadow-lg hover:bg-blue-600 flex items-center justify-center"
        >
          {isOpen ? <FiChevronLeft size={28} /> : <FiChevronRight size={28} />}
        </div>

        {/* 📌 選單內容 */}
        <h1 className={`text-xl font-bold mb-6 ${isOpen ? "block" : "hidden"}`}>
          任務管理
        </h1>

        <nav className="flex flex-col space-y-2">
          {/* 🚀 儀表板 */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) => getNavItemClasses(isActive)}
          >
            <FiHome className={iconStyle} />
            <span className={`${spanStyle} ${isOpen ? "block" : "hidden"}`}>
              儀表板
            </span>
          </NavLink>

          {/* 🚀 專案總覽 */}
          <NavLink
            to="/tasks"
            className={({ isActive }) => getNavItemClasses(isActive)}
          >
            <FiList className={iconStyle} />
            <span className={`${spanStyle} ${isOpen ? "block" : "hidden"}`}>
              專案總覽
            </span>
          </NavLink>

          {/* 🔥 專案列表 (展開 Sidebar 時才顯示) */}
          {isOpen && (
            <div className="ml-4">
              {isLoading ? (
                <p className="text-gray-400 mt-2">🔄 載入中...</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {projects?.map((project) => (
                    <li
                      key={project.id}
                      onClick={() => navigate(`/tasks/${project.id}`)}
                      className={`p-2 cursor-pointer rounded ${
                        project.id === projectId
                          ? "bg-gray-600"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      {project.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* 🚀 設定 */}
          <NavLink
            to="/settings"
            className={({ isActive }) => getNavItemClasses(isActive)}
          >
            <FiSettings className={iconStyle} />
            <span className={`${spanStyle} ${isOpen ? "block" : "hidden"}`}>
              設定
            </span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
