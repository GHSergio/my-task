import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectRouter";
import React, { Suspense } from "react";
import { ShimmerEffect, SkeletonLoader } from "../components/loading";

const DashboardHome = React.lazy(
  () => import("../pages/Dashboard/DashboardHome")
);

const ProjectList = React.lazy(() => import("../pages/Projects/ProjectList"));
const TaskList = React.lazy(() => import("../pages/Tasks/TaskList"));
const Setting = React.lazy(() => import("../pages/Settings/Setting"));

const AppRoutes = () => {
  return (
    <Routes>
      {/* 公開頁面 */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 受保護路由 */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* 🚀 Dashboard 用 Shimmer Effect */}
        {/* 預設 path="/" 時 載入 <DashboardHome /> */}
        <Route
          index
          element={
            <Suspense fallback={<ShimmerEffect />}>
              <DashboardHome />
            </Suspense>
          }
        />
        <Route
          path="dashboard"
          element={
            <Suspense fallback={<ShimmerEffect />}>
              <DashboardHome />
            </Suspense>
          }
        />
        {/* 🚀 「專案總覽」頁面（/tasks） */}
        <Route path="tasks">
          <Route
            index
            element={
              <Suspense fallback={<SkeletonLoader />}>
                <ProjectList />
              </Suspense>
            }
          />
          {/* 🚀 「任務列表」頁面（/tasks/:projectId） */}
          <Route
            path=":projectId"
            element={
              <Suspense fallback={<SkeletonLoader />}>
                <TaskList />
              </Suspense>
            }
          ></Route>
        </Route>

        {/* 🚀 Settings 直接用文字 Loading */}
        <Route
          path="settings"
          element={
            <Suspense fallback={<div>Loading Settings...</div>}>
              <Setting />
            </Suspense>
          }
        />
      </Route>

      {/* 404 頁面 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
