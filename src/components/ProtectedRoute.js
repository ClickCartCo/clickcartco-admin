import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isUserLoggedIn = useSelector((state) => state?.auth?.user?.accessToken);
  return isUserLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
