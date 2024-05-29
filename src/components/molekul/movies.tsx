import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Box, Collapse, FormControlLabel } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import BackendInteractor from "../../app/api";

import { Await, TMovie } from "../../interface";

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
  const { mutate: deleteMovie } = useMutation(
    async ({ id }: { id: number; index: number }) =>
      backendInteractor.deleteMovie(id),
    {
      async onSuccess({ message }: { message: string }, { index }) {
        setMovies((prevValue) => {
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

  const [showUpdateForm, setShowUpdateForm] = React.useState(false);
  const { handleSubmit, getFieldProps, errors, touched, setFieldValue } =
    useFormik({
      initialValues: {
        index: 0,
        movie_id: 0,
        title: "",
      },
      validationSchema: Yup.object({
        title: Yup.string().required("Title required").min(1),
      }),
      onSubmit: (values, { resetForm }) => {
        updateMovie(values);
        resetForm();
      },
    });
  const { mutate: updateMovie, isLoading } = useMutation(
    async (payload: { movie_id: number; title: string; index: number }) =>
      backendInteractor.updateMovie(payload),
    {
      async onSuccess({ message }: { message: string }, { index, title }) {
        setMovies((prevValues) => {
          const newValues = [...prevValues];
          newValues[index].title = title;
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
        <ButtonAddMovie setMovies={setMovies} />
      </HeaderWrapper>
      <Divider />
      {!loading ? (
        <MovieContainer>
          {movies?.map(({ title, thumbnail, id }, index) => {
            return (
              <BasicModal
                key={id}
                onClose={() => setShowUpdateForm(false)}
                CustomeButton={({ onClick }) => {
                  return (
                    <MovieBox onClick={onClick} key={title}>
                      <MovieThumbnail src={thumbnail} alt={title} />
                      {title}
                    </MovieBox>
                  );
                }}
              >
                <ModifyMovieContainer>
                  <ModifyMovieHeader>
                    <p>{title}</p>
                    <ModifyMovieButtonWrapper>
                      <FormControlLabel
                        control={
                          <ModifyMovieButton
                            onClick={() => setShowUpdateForm((prev) => !prev)}
                          >
                            <EditIcon style={{ fill: "green" }} />
                          </ModifyMovieButton>
                        }
                        label=""
                      />

                      <ModifyMovieButton
                        onClick={() => deleteMovie({ id, index })}
                      >
                        <DeleteIcon style={{ fill: "red" }} />
                      </ModifyMovieButton>
                    </ModifyMovieButtonWrapper>
                  </ModifyMovieHeader>
                  <Box>
                    <Collapse in={showUpdateForm}>
                      <form
                        onSubmit={(e) => {
                          setFieldValue("movie_id", id);
                          setFieldValue("index", index);
                          handleSubmit(e);
                        }}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <p>Update Movie</p>
                        <div>
                          <input
                            type="text"
                            placeholder="Title"
                            {...getFieldProps("title")}
                          />
                        </div>
                        {touched.title && errors.title ? (
                          <p
                            style={{
                              color: "red",
                              fontSize: 16,
                              padding: 0,
                              margin: 0,
                            }}
                          >
                            {errors.title}
                          </p>
                        ) : null}
                        <button
                          type="submit"
                          style={{ margin: 5 }}
                          disabled={isLoading}
                        >
                          {isLoading ? "Loading" : "Update"}
                        </button>
                      </form>
                    </Collapse>
                  </Box>
                </ModifyMovieContainer>
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
