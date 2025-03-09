// import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config"; // 需要從 `vitest/config` 引入

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 3333,
    open: true,
  },
  test: {
    globals: true, // ✅ 允許 `describe`, `test` 等全域函數
    environment: "jsdom", // ✅ 模擬瀏覽器環境
    setupFiles: "./src/tests/setup.ts", // ✅ 設定測試環境
  },
});
