import React, { useState } from "react";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { useAlert } from "./../../store/alert-context/AlertContext";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();
  const { showAlert } = useAlert();
  const userName = "Ming"; // 這裡可以替換成從 `useAuth()` 獲取的名稱
  const firstLetter = userName.charAt(0).toUpperCase(); // 取得名稱開頭並轉大寫

  const handleLogout = () => {
    console.log("登出...");
    logout();
    setIsMenuOpen(false);
    showAlert("您已成功登出！");
  };

  // const handleAlert = () => {
  //   showAlert("你點到我了！");
  // };

  return (
    <nav className="bg-gray-300 shadow-md p-4 flex justify-between items-center">
      <h2 className="text-lg text-blue-900 font-semibold">任務管理系統</h2>

      {/* 測試button */}
      {/* <button className="bg-black" onClick={handleAlert}>
        點我
      </button> */}

      {/* 📌 使用者區塊 */}
      <div className="relative">
        {/* Avatar + 漢堡選單 */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center space-x-2 bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          {/* Avatar - 名稱開頭字母 */}
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
            {firstLetter}
          </span>
          {/* 使用者名稱
          <span className="text-sm font-medium">{userName}</span> */}
          {/* 漢堡選單圖示 */}
          <FiMenu className="ml-2" />
        </button>

        {/* 📌 下拉選單 (登出按鈕) */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md py-2 border">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-200 transition"
            >
              <FiLogOut className="mr-2" />
              登出
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
