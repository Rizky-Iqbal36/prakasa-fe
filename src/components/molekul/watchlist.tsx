import React, { useEffect, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import {
  Container,
  Divider,
  HeaderWrapper,
  PageTitle,
} from "../../styles/molekul/sidebar.element";
import {
  WatchlistButton,
  WatchlistButtonWrapper,
  WatchlistContainer,
  WatchlistHeader,
  WatchlistMovieWrapper,
  WatchlistName,
} from "../../styles/molekul/watchlist.element";

import ButtonAddWatchlist from "../atom/buttonAddWatchlist";

import { useAuth } from "../../app/context/AuthProvider";

import BackendInteractor from "../../app/api";

import { TMovie, TWatchlist } from "../../interface";
import { Collapse } from "@mui/material";
import {
  MovieBox,
  MovieContainer,
  MovieThumbnail,
} from "../../styles/molekul/movies.element";
import { useMutation } from "react-query";
import ButtonEditWatchlist from "../atom/buttonEditWatchlist";
import { Option } from "react-multi-select-component";

const WatclisthScreen = () => {
  const { token } = useAuth();
  const backendInteractor = new BackendInteractor(token);

  const [watchlist, setWatchlist] = useState<TWatchlist[]>([]);
  const [showMovies, setShowMovies] = useState<boolean[]>([]);
  const [availableMovies, setAvailableMovies] = useState<TMovie[]>([]);
  const [moviesOption, setMoviesOption] = useState<Option[]>([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    backendInteractor.watchlist().then((data) => {
      setWatchlist(data);
      setShowMovies(new Array(data.length).fill(false));
      backendInteractor.movies().then((data) => {
        setAvailableMovies(data);
        setMoviesOption(
          data.map(({ id, title }) => ({
            value: id,
            label: title,
          }))
        );
        setLoading(false);
      });
    });
  }, []);

  const { mutate: deleteWatchlist } = useMutation(
    async ({ id }: { id: number; index: number }) =>
      backendInteractor.deleteWatchlist(id),
    {
      async onSuccess({ message }: { message: string }, { index }) {
        setWatchlist((prevValue) => {
          const newValue = prevValue;
          newValue.splice(index, 1);
          return newValue;
        });
        window.alert(message);
      },
      onError(err: any) {
        const data = err.response.data;
        window.alert(data.message);
      },
    }
  );

  return (
    <Container>
      <HeaderWrapper>
        <PageTitle>Watchlist</PageTitle>
        <ButtonAddWatchlist
          setWatchlist={setWatchlist}
          movies={availableMovies}
          moviesOption={moviesOption}
        />
      </HeaderWrapper>
      <Divider />
      {!loading ? (
        watchlist.map(({ id, name, movies }, index) => {
          return (
            <WatchlistContainer key={id}>
              <WatchlistHeader>
                <WatchlistName>{name}</WatchlistName>
                <WatchlistButtonWrapper>
                  <WatchlistButton
                    onClick={() => {
                      setShowMovies((values) => {
                        const newValues = [...values];
                        const value = newValues[index];
                        newValues[index] = !value;
                        return newValues;
                      });
                    }}
                  >
                    {showMovies[index] ? (
                      <VisibilityOffIcon style={{ fill: "red" }} />
                    ) : (
                      <VisibilityIcon style={{ fill: "green" }} />
                    )}
                  </WatchlistButton>
                  <ButtonEditWatchlist
                    watchlistIndex={index}
                    watchlist={{ id, name, movies }}
                    movies={availableMovies}
                    setWatchlist={setWatchlist}
                  />
                  <WatchlistButton
                    onClick={() => deleteWatchlist({ id, index })}
                  >
                    <DeleteIcon style={{ fill: "red" }} />
                  </WatchlistButton>
                </WatchlistButtonWrapper>
              </WatchlistHeader>
              <WatchlistMovieWrapper>
                <Collapse in={showMovies[index]}>
                  <MovieContainer>
                    {movies.map(({ title, thumbnail }) => {
                      return (
                        <MovieBox key={title}>
                          <MovieThumbnail src={thumbnail} alt={title} />
                          {title}
                        </MovieBox>
                      );
                    })}
                  </MovieContainer>
                </Collapse>
              </WatchlistMovieWrapper>
            </WatchlistContainer>
          );
        })
      ) : (
        <></>
      )}
    </Container>
  );
};

export default WatclisthScreen;
