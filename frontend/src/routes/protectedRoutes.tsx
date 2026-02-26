import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { ReactNode } from "react";
import { AuthUser } from "@/types/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole?: AuthUser["role"];
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const { data: user, isLoading, isError } = useAuth();

  if (isLoading) {
    return <div>Checking authentication...</div>;
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;