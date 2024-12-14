import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isFaculty = localStorage.getItem("isFaculty") === "true";

  if (!isFaculty) {
    // Redirect to home if the user is not a faculty member
    return <Navigate to="/" replace />;
  }

  // Render the protected route if the user is a faculty member
  return children;
};

export default ProtectedRoute;
