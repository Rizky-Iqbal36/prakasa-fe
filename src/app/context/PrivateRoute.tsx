import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Sidebar from "../../components/molekul/sidebar";
import styled from "styled-components";

const Pages = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  margin-left: 10vw;
`;

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
