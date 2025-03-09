import { createContext, useContext } from "react";
import { AlertContextType } from "./AlertTypes";
// 型別放在獨立的檔案

// `AlertContext` 只負責 `createContext`
export const AlertContext = createContext<AlertContextType | undefined>(
  undefined
);

// `useAlert()` 讓其他元件可以存取 `AlertContext`
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert 必須在 AlertProvider 內使用");
  }
  return context;
};
