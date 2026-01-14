/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};