import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "../../features/auth/store/authStore";

interface ProtectedRouteProps {
  moduleCode: string;
}

const ProtectedRoute = ({
  moduleCode,
}: ProtectedRouteProps) => {

  const isAuthenticated =
    useAuthStore(
      (state) => state.isAuthenticated
    );

  const hasModule =
    useAuthStore(
      (state) => state.hasModule
    );

  /**
   * User is not logged in.
   */
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /**
   * User doesn't have
   * permission for this module.
   */
  if (!hasModule(moduleCode)) {
    return (
      <Navigate
        to="/access-denied"
        replace
      />
    );
  }

  /**
   * Permission exists.
   */
  return <Outlet />;
};

export default ProtectedRoute;