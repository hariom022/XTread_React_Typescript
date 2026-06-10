import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";

  return isLoggedIn ? (
    <>{children}</>
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoute;