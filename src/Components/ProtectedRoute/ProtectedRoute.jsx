import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export default function ProtectedRoute({ children }) {
  const { isLogin } = useContext(UserContext);

  return isLogin ? children : <Navigate to="/login" />;
}
