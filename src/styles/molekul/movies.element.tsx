import styled from "styled-components";

export const MovieContainer = styled.div`
  margin: 0 0 4vh 0;
  border-radius: 5px;
  height: max-content;
  width: 100%;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(4, 1fr);
`;

export const MovieBox = styled.div`
  margin: 0;
  display: flex;
  flex-direction: column;
  width: 240px;
  cursor: pointer;
`;

export const MovieThumbnail = styled.img`
  margin: 0;
  width: 240px;
  height: 360px;
  border-radius: 20px;
`;

export const ModifyMovieContainer = styled.div``;

export const ModifyMovieHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModifyMovieButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const ModifyMovieButton = styled.div`
  cursor: pointer;
`;
