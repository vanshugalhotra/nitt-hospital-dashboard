import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { data: user, isLoading, isError } = useAuth();
  console.log("ProtectedRoute - User:", user.role);
   if (isLoading) {
    return <div>Checking authentication...</div>;
  }

   if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

    if (allowedRole && user.role.toLowerCase() !== allowedRole.toLowerCase()) {
    return <Navigate to={`/${user.role}`} replace />;
  }

    return children;
};

export default ProtectedRoute;