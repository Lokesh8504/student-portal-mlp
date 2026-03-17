import { Navigate } from "react-router-dom";

/**
 * Simple route protection.
 * If token does not exist → redirect to login.
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
