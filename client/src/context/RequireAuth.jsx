import useAuth from "./useAuth";
import { Outlet, Navigate } from "react-router-dom";
import React from "react";

const RequireAuth = () => {
  // const location = useLocation();
  const { auth } = useAuth();

  return auth ? <Outlet /> : <Navigate to="/" />;
};

export default RequireAuth;
