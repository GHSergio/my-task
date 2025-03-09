import AppRoutes from "./routes/AppRoutes";
import { Suspense } from "react";
import { PreloadingScreen } from "./components/loading";

function App() {
  return (
    // 顯示轉圈圈動畫
    <Suspense fallback={<PreloadingScreen />}>
      <AppRoutes />
    </Suspense>
  );
}

export default App;
