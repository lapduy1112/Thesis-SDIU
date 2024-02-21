import { Navigate, Outlet } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";

export default function PrivateAdminRoutes() {
  const { isAdminLogin, isLoading } = useSelector((state) => state.account);
  if (!isAdminLogin && !localStorage.getItem("authAdminToken")) {
    return <Navigate replace to="/login" />;
  }
  return <Outlet />;
}
