import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 模擬登入成功 (在真實應用中應該是 API 請求)
    localStorage.setItem("authToken", "mocked-token");

    // 登入成功後，導向 Dashboard
    navigate("/dashboard");
  };

  const inputStyle =
    "w-full p-2 mb-3 border rounded focus:ring-2 focus:ring-blue-400";

  return (
    <div className="h-screen flex justify-center items-center bg-gray-500">
      <div className="bg-blue-300 p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-3xl text-green-700 font-bold text-center mb-4">
          使用者登入
        </h2>
        <form onSubmit={handleLogin} method="POST">
          <input
            type="email"
            placeholder="Email"
            className={inputStyle}
            title="請填寫信箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={inputStyle}
            title="請填寫密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600"
          >
            登入
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
