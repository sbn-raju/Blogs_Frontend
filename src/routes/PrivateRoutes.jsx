// src/components/PrivateRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useAuth } from "../hooks/authHook";

const PrivateRoute = ({ children }) => {
  const { authState } = useContext(AuthContext);

  console.log(authState);

  if (!authState.user || !authState.token) {
    // If user is not logged in, redirect to login
    return <Navigate to="/login" />;
  }

  // If user is logged in, render the child components
  return children;
};

export default PrivateRoute;
