import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NotFound = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // 檢查是否登入

  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      if (isAuthenticated) {
        navigate("/"); // ✅ 已登入者，跳轉回首頁
      } else {
        navigate("/login"); // ❌ 未登入者，跳轉到登入頁
      }
    }, 2000);

    return () => clearTimeout(redirectTimeout); // 避免記憶體洩漏
  }, [isAuthenticated, navigate]);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-red-600 mb-2">404 - 找不到頁面</h1>
      <p className="text-xl text-blue-300">2秒後將自動跳轉...</p>
      <div className="mt-4">
        {isAuthenticated ? (
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            回到首頁
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            前往登入
          </button>
        )}
      </div>
    </div>
  );
};

export default NotFound;
