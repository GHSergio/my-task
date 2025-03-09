import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AlertProvider } from "./store/alert-context/AlertProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // ✅ 設置 React Query
import "./styles/index.css";
import App from "./App.tsx";

const queryClient = new QueryClient(); // ✅ 創建 QueryClient 實例

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 包裹整個App */}
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AlertProvider>
          <App />
        </AlertProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
