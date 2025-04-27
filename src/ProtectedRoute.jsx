import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { data } = useSelector((state) => state.user);

  if (!data?.token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && data?.user?.user_role !== requiredRole) {
    return <Navigate to="/not-found" replace />;
  }

  return children;
};

export default ProtectedRoute;
