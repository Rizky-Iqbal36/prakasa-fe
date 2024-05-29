import React from "react";
import { Cookies } from "react-cookie";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import LogoutIcon from "@mui/icons-material/Logout";

import { useAuth } from "../../app/context/AuthProvider";


const Logout = styled.button`
  border: none;
  width: 2rem;
  height: 2rem;
  background-color: transparent;

  svg {
    width: 100%;
    height: auto;
    filter: invert(15%) sepia(70%) saturate(6573%) hue-rotate(2deg)
      brightness(100%) contrast(126%);
    transition: all 0.3s ease;
    &:hover {
      border: none;
      padding: 0;
      opacity: 0.5;
    }
  }
`;

const LogoutButton = () => {
  const context = useAuth();
  const navigate = useNavigate();
  const cookies = new Cookies();
  return context.token ? (
    <Logout
      type="button"
      style={{
        cursor: "pointer",
        margin: "0 20px 0 0",
        backgroundColor: "#d9534f",
        color: "white",
        borderRadius: 10,
      }}
      onClick={() => {
        cookies.remove("accessToken");
        context.setToken("");
        localStorage.removeItem("user");
        window.alert("Success Logout, Redirecting you to home page!");
        navigate("/");
      }}
    >
      <LogoutIcon />
    </Logout>
  ) : (
    <></>
  );
};
export default LogoutButton;
