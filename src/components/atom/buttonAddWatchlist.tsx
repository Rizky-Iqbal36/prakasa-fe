import React, { useEffect, useState } from "react";
import { MultiSelect, Option } from "react-multi-select-component";

import _ from "lodash";
import { useFormik } from "formik";
import * as Yup from "yup";

import BasicModal from "./modal";
import BackendInteractor from "../../app/api";
import { useAuth } from "../../app/context/AuthProvider";
import { useMutation } from "react-query";
import { TMovie, TWatchlist } from "../../interface";
import styled from "styled-components";
// import { TextField } from "@mui/material";

const StyledMultiSelect = styled(MultiSelect)`
  width: 70%;
`;

const ButtonAddWatchlist: React.FC<{
  setWatchlist: React.Dispatch<React.SetStateAction<TWatchlist[]>>;
}> = ({ setWatchlist }) => {
  const { token } = useAuth();
  const [movies, setMovies] = useState<TMovie[]>([]);
  const [moviesOption, setMoviesOption] = useState<Option[]>([]);

  const backendInteractor = new BackendInteractor(token);
  const { handleSubmit, getFieldProps, errors, touched, setFieldValue } =
    useFormik({
      initialValues: {
        name: "",
        movies: [] as number[],
      },
      validationSchema: Yup.object({
        name: Yup.string().required("Name required").min(1),
        movies: Yup.array()
          .of(Yup.number())
          .min(1, "At least one movie is required"),
      }),
      onSubmit: (values, { resetForm }) => {
        addWatchlist(values);
        resetForm();
        setSelected([]);
      },
    });
  const { mutate: addWatchlist, isLoading } = useMutation(
    async (payload: { name: string; movies: number[] }) =>
      backendInteractor.addWatchlist(payload),
    {
      async onSuccess(
        { message, data }: { message: string; data: { watchlist_id: number } },
        { name, movies: movieIds }
      ) {
        window.alert(message);
        setWatchlist((prevValue) => {
          const newValue = [...prevValue];
          const newWatchlistMovies = [];
          for (const movieId of movieIds) {
            const movie = _.find(movies, { id: movieId }) as TMovie;
            newWatchlistMovies.push(movie);
          }
          newValue.push({
            id: data.watchlist_id,
            name,
            movies: newWatchlistMovies,
          });
          return newValue;
        });
        console.log("Success Add watchlist", movies);
      },
      onError(err: any) {
        const data = err.response.data;
        window.alert(data.message);
      },
    }
  );

  const [selected, setSelected] = useState<Option[]>([]);
  useEffect(() => {
    backendInteractor.movies().then((data) => {
      setMovies(data);
      setMoviesOption(
        data.map(({ id, title }) => ({
          value: id,
          label: title,
        }))
      );
    });
  }, []);

  return (
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
        <p>Add Watchlist</p>
        <div>
          <input type="text" placeholder="Name" {...getFieldProps("name")} />
        </div>
        {touched.name && errors.name ? (
          <p style={{ color: "red", fontSize: 16, padding: 0, margin: 0 }}>
            {errors.name}
          </p>
        ) : null}

        <StyledMultiSelect
          options={moviesOption}
          value={selected}
          onChange={(changedValue: Option[]) => {
            setFieldValue("movies", _.map(changedValue, "value"));
            setSelected(changedValue);
          }}
          labelledBy="Select Movies"
          data-placeholder="Select Movies"
        />
        {touched.movies && errors.movies && (
          <p style={{ color: "red", fontSize: 16, padding: 0, margin: 0 }}>
            {errors.movies}
          </p>
        )}
        <button type="submit" style={{ margin: 5 }} disabled={isLoading}>
          {isLoading ? "Loading" : "Add"}
        </button>
      </form>
    </BasicModal>
  );
};
export default ButtonAddWatchlist;
