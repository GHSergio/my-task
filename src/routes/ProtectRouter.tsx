import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PreloadingScreen } from "../components/loading";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <PreloadingScreen />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
