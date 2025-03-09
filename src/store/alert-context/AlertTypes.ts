// ✅ 使用 type alias 讓程式碼更乾淨
export type AlertType = "success" | "error" | "warning";

// ✅ `AlertContextType` 使用 `AlertType`
export interface AlertContextType {
  // alertMessage: string | null;
  // alertType: AlertType;
  showAlert: (message: string, type?: AlertType, duration?: number) => void;
  // closeAlert: () => void;
}
