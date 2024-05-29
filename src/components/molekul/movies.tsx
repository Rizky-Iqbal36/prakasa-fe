import React, { useEffect, useState } from "react";
import { useAuth } from "../../app/context/AuthProvider";
import BackendInteractor from "../../app/api";
import { Await } from "../../interface";
import {
  Container,
  Divider,
  PageTitle,
} from "../../styles/molekul/sidebar.element";
import {
  MovieContainer,
  MovieBox,
  MovieThumbnail,
} from "../../styles/molekul/movies.element";

const MoviesScreen = () => {
  const { token } = useAuth();
  const backendInteractor = new BackendInteractor(token);
  const [movies, setMovies] =
    useState<Await<ReturnType<typeof backendInteractor.movies>>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    backendInteractor.movies().then((data) => {
      setMovies(data);
      setLoading(false);
    });
  }, []);

  return (
    <Container>
      <PageTitle>Movies</PageTitle>
      <Divider />
      {!loading ? (
        <MovieContainer>
          {movies?.map(({ title, thumbnail }) => {
            return (
              <MovieBox>
                <MovieThumbnail src={thumbnail} alt={title} />
                {title}
              </MovieBox>
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
