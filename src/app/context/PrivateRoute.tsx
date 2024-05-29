import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Sidebar from "../../components/molekul/sidebar";
import { Pages } from "../../styles/molekul/sidebar.element";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const context = useAuth();

  if (!context.token) return <Navigate to="/" />;

  return (
    <>
      <Sidebar />
      <Pages>{children}</Pages>
    </>
  );
}

export default PrivateRoute;
