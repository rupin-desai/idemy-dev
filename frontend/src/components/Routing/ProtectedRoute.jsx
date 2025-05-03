import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  isAuthenticated,
  isAuthorized = true,
  authPath = "/login",
  redirectPath,
  children,
}) => {
  if (!isAuthenticated) {
    return (
      <Navigate to={authPath} state={{ from: window.location.pathname }} />
    );
  }

  if (!isAuthorized) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
