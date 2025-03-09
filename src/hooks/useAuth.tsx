import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// 集中管理登入狀態 (isAuthenticated)，可供多個元件使用
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 模擬 API 請求，確認登入狀態 (例如檢查 localStorage)
    setTimeout(() => {
      const token = localStorage.getItem("authToken");
      // !! 是 JavaScript 強制轉換為布林值 的方式。
      setIsAuthenticated(!!token); // 如果有 token，就設為已登入
      setLoading(false); // ✅ 取得登入狀態後，關閉 `loading`
    }, 2000); // 假設 API 需要 1 秒
  }, []);

  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return { isAuthenticated, loading, login, logout };
};
