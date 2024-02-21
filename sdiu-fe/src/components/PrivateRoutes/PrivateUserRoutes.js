import { Navigate, Outlet } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";

function PrivateUserRoutes(){
  const { isLogin, isLoading } = useSelector((state) => state.account);
  // if (isLoading) {
  //   return <h1>Loading</h1>;
  // }
  if (!isLogin || !localStorage.getItem("authToken")) {
    return <Navigate replace to="/login" />;
  }
  return <Outlet />;
};
export default PrivateUserRoutes;