import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import styled, { css } from "styled-components";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import LogoutButton from "../atom/logoutButton";

type TPropClicked = { $props: { clicked: boolean } };

const Container = styled.div`
  position: fixed;
  z-index: 1;
`;

const Button = styled.button<TPropClicked>`
  background-color: var(--black);
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin: 0.5rem 0 0 0.5rem;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;

  &::before,
  &::after {
    content: "";
    background-color: var(--white);
    height: 2px;
    width: 1rem;
    position: absolute;
    transition: all 0.3s ease;
  }

  ${({ $props }) => {
    return css`
      &:before {
        top: ${$props.clicked ? "1.5" : "1rem"};
        transform: ${$props.clicked ? "rotate(135deg)" : "rotate(0)"};
      }

      &:after {
        top: ${$props.clicked ? "1.2" : "1.5rem"};
        transform: ${$props.clicked ? "rotate(-135deg)" : "rotate(0)"};
      }
    `;
  }}
`;

const SidebarContainer = styled.div`
  background-color: var(--black);
  width: 3.5rem;
  margin-top: 1rem;
  border-radius: 0 30px 30px 0;
  padding: 1rem 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  position: relative;
`;

const Logo = styled.div`
  width: 2rem;

  img {
    width: 100%;
    height: auto;
  }
`;

const SlickBar = styled.ul<TPropClicked>`
  color: var(--white);
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--black);

  padding: 2rem 0;

  position: absolute;
  top: 6rem;
  left: 0;

  ${({ $props }) => {
    return {
      width: $props.clicked ? "12rem" : "3.5rem",
    };
  }}
  transition: all 0.5s ease;
  border-radius: 0 30px 30px 0;
`;

const Item = styled(NavLink)`
  text-decoration: none;
  color: var(--white);
  width: 100%;
  padding: 1rem 0;
  cursor: pointer;

  display: flex;
  padding-left: 1rem;

  svg {
    width: 1.2rem;
    height: auto;
    fill: white;
  }
`;

const Text = styled.span<{ $props: { clicked: boolean; active: boolean } }>`
  ${({ $props }) => {
    return css`
      width: ${$props.clicked ? "100%" : "0"};
      margin-left: ${$props.clicked ? "1.5rem" : "0"};
      color: ${$props.active ? "var(--active)" : "white"};
    `;
  }}
  overflow: hidden;
  transition: all 0.3s ease;
`;

const Profile = styled.div<TPropClicked>`
  ${({ $props }) => {
    return css`
      width: ${$props.clicked ? "auto" : "3rem"};
    `;
  }}
  margin: 0;
  height: 3rem;

  border-radius: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--black);
  color: var(--white);

  transition: all 0.3s ease;

  svg {
    cursor: pointer;
  }
`;

const Details = styled.div<TPropClicked>`
  ${({ $props }) => {
    return css`
      display: ${$props.clicked ? "flex" : "none"};
      margin-left: ${$props.clicked ? "16rem" : "0"};
    `;
  }}
  transition: all 0.3s ease-in 0s;
  justify-content: space-between;
  align-items: center;
`;

const Name = styled.div`
  padding: 0 1rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 20px;

  h4 {
    display: inline-block;
  }

  a {
    font-size: 0.8rem;
    text-decoration: none;
    color: var(--grey);

    &:hover {
      text-decoration: underline;
    }
  }
`;

const sidebar = () => {
  const location = useLocation();

  const [user] = useState(JSON.parse(localStorage.getItem("user") ?? "false"));

  const [clicked, setClick] = useState(false);
  const handleClick = () => setClick(!clicked);

  const [profileClick, setprofileClick] = useState(false);
  const handleProfileClick = () => setprofileClick(!profileClick);

  const ItemData = [
    {
      name: "Movies",
      path: "/movies",
      icons: (active: boolean) => (
        <LocalMoviesIcon style={{ fill: active ? "var(--active)" : "white" }} />
      ),
    },
    {
      name: "Watchlist",
      path: "/watchlist",
      icons: (active: boolean) => (
        <PlaylistPlayIcon
          style={{ fill: active ? "var(--active)" : "white" }}
        />
      ),
    },
  ];

  return (
    <Container>
      <Button $props={{ clicked }} onClick={() => handleClick()} />
      <SidebarContainer>
        <SlickBar $props={{ clicked }}>
          {ItemData.map(({ icons, name, path }) => {
            const isActive = location.pathname === path;
            return (
              <Item key={name} to={path}>
                {icons(isActive)}
                <Text $props={{ clicked, active: isActive }}>{name}</Text>
              </Item>
            );
          })}
        </SlickBar>
        <Profile $props={{ clicked: profileClick }}>
          <AccountCircleIcon
            style={{ position: "absolute" }}
            onClick={() => handleProfileClick()}
          />
          <Details $props={{ clicked: profileClick }}>
            <Name>{user.email}</Name>
            <LogoutButton />
          </Details>
        </Profile>
      </SidebarContainer>
    </Container>
  );
};

export default sidebar;
