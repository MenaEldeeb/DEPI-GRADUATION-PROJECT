import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export default function ProtectedRoute({ children, requireDashboard = false }) {
  const { isLogin } = useContext(UserContext);
  const canAccessDashboard = localStorage.getItem("canAccessDashboard");

  if (!isLogin) return <Navigate to="/login" />;
  if (requireDashboard && canAccessDashboard !== "true") return <Navigate to="/home" />;

  return children;
}
