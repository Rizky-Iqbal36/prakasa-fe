import { Box } from "@mui/material";
import styled from "styled-components";

export const WatchlistContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
`;

export const WatchlistHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const WatchlistName = styled.h3``;
export const WatchlistButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;
export const WatchlistButton = styled.div`
  cursor: pointer;
`;

export const WatchlistMovieWrapper = styled(Box)``;
