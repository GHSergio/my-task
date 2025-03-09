import { ReactNode } from "react";
import { AlertContext } from "./AlertContext";
import { AlertContextType } from "./AlertTypes";
import { toast } from "react-toastify";

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  // 📌 `showAlert` 改用 `react-toastify`
  const showAlert: AlertContextType["showAlert"] = (
    message: string,
    type: "success" | "error" | "warning" = "success"
  ) => {
    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    else toast.warn(message);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
