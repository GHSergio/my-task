// src/components/layout/Layout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ✅ 引入Alert樣式

const Layout = () => {
  return (
    <div className="flex">
      {/* 側邊欄 (Sidebar) */}
      <Sidebar />

      {/* 主要內容區域 */}
      <div className="flex-1 flex-col">
        {/* 頁首 (Navbar) */}
        <Navbar />

        {/* 主要內容：透過 Outlet 渲染子路由 */}
        <main className="flex-1 w-[95%] min-h-[800px] mx-auto p-4">
          <Outlet />
        </main>

        {/* 頁尾 (Footer) */}
        <Footer />
      </div>

      {/* 📌 設置 `react-toastify` 全域通知 */}
      <ToastContainer
        position="top-center" // 🟢 提示框位置
        autoClose={2000} // ⏳ 自動關閉時間 (毫秒)
        hideProgressBar={false} // 🔵 顯示進度條
        newestOnTop={true} // 🔥 新提示顯示在最上方
        closeOnClick={true} // 🖱️ 點擊即可關閉
        rtl={false} // 🌍 是否啟用從右到左顯示
        pauseOnFocusLoss={false} // ⏸️ 失去焦點時暫停
        draggable // 🖱️ 可拖動
        pauseOnHover // 🛑 滑鼠移上去時暫停關閉
        theme="colored" // 🎨 可選：light, dark, colored
      />
    </div>
  );
};

export default Layout;
