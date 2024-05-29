import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useFormik } from "formik";
import * as Yup from "yup";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import BackendInteractor from "../../app/api";

import { Await } from "../../interface";

import { useAuth } from "../../app/context/AuthProvider";

import BasicModal from "../atom/modal";

import {
  Container,
  Divider,
  HeaderWrapper,
  PageTitle,
} from "../../styles/molekul/sidebar.element";
import {
  MovieContainer,
  MovieBox,
  MovieThumbnail,
  ModifyMovieContainer,
  ModifyMovieHeader,
  ModifyMovieButtonWrapper,
  ModifyMovieButton,
} from "../../styles/molekul/movies.element";
import ButtonAddMovie from "../atom/buttonAddMovie";

type TMovie = Await<ReturnType<typeof BackendInteractor.prototype.movies>>[0];
const MoviesScreen = () => {
  const { token } = useAuth();
  const backendInteractor = new BackendInteractor(token);

  const [movies, setMovies] = useState<TMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    backendInteractor.movies().then((data) => {
      setMovies(data);
      setLoading(false);
    });
  }, []);

  return (
    <Container>
      <HeaderWrapper>
        <PageTitle>Movies</PageTitle>
        <ButtonAddMovie setMovies={setMovies} />
      </HeaderWrapper>
      <Divider />
      {!loading ? (
        <MovieContainer>
          {movies?.map(({ title, thumbnail }) => {
            return (
              <BasicModal
                CustomeButton={({ onClick }) => {
                  return (
                    <MovieBox onClick={onClick} key={title}>
                      <MovieThumbnail src={thumbnail} alt={title} />
                      {title}
                    </MovieBox>
                  );
                }}
              >
                {title}
              </BasicModal>
            );
          })}
        </MovieContainer>
      ) : (
        <></>
      )}
    </Container>
  );
};

export default MoviesScreen;
