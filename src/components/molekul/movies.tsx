import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { Cookies } from "react-cookie";
import { useFormik } from "formik";
import * as Yup from "yup";

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
} from "../../styles/molekul/movies.element";

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

  const { handleSubmit, getFieldProps, errors, touched } = useFormik({
    initialValues: {
      title: "",
      studio: "",
      thumbnail: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title required").min(1),
      studio: Yup.string().required("Studio Required").min(8),
      thumbnail: Yup.string().required("Studio Required"),
    }),
    onSubmit: (values) => addMovie(values),
  });
  const { mutate: addMovie, isLoading } = useMutation(
    async (payload: any) => backendInteractor.addMovie(payload),
    {
      async onSuccess({
        data,
        message,
      }: {
        data: { movie: TMovie };
        message: string;
      }) {
        setMovies((prevValues) => {
          const newValues = [...prevValues, data.movie];
          return newValues;
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
        <PageTitle>Movies</PageTitle>
        <BasicModal>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p>Add Movie</p>
            <div>
              <input
                type="text"
                placeholder="Title"
                {...getFieldProps("title")}
              />
            </div>
            {touched.title && errors.title ? (
              <p style={{ color: "red", fontSize: 16, padding: 0, margin: 0 }}>
                {errors.title}
              </p>
            ) : null}
            <div>
              <input
                type="text"
                placeholder="Studio"
                {...getFieldProps("studio")}
              />
            </div>
            {touched.studio && errors.studio ? (
              <p style={{ color: "red", fontSize: 16, padding: 0, margin: 0 }}>
                {errors.studio}
              </p>
            ) : null}
            <div>
              <input
                type="text"
                placeholder="Thumbnail URL"
                {...getFieldProps("thumbnail")}
              />
            </div>
            {touched.thumbnail && errors.thumbnail ? (
              <p style={{ color: "red", fontSize: 16, padding: 0, margin: 0 }}>
                {errors.thumbnail}
              </p>
            ) : null}
            <button type="submit" style={{ margin: 5 }} disabled={isLoading}>
              {isLoading ? "Loading" : "Add"}
            </button>
          </form>
        </BasicModal>
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
