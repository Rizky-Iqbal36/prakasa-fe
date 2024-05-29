import styled from "styled-components";

export const Pages = styled.div`
  width: 85vw;
  height: 100vh;
  display: flex;
  transform: translateX(10vw);
  z-index: 0;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const PageTitle = styled.h1`
  margin: 10px 0;
`;

export const Divider = styled.hr`
  width: 100%;
  border-top: 3px solid var(--black);
  border-radius: 5px;
`;
