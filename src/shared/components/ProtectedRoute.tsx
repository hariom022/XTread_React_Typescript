import { Navigate } from "react-router-dom";
// import { isAuthenticated } from "../services/authService";
import { isAuthenticated } from "../../features/auth/services/authService";
type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const authenticated = isAuthenticated();

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;