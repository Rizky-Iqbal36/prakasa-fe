import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import BasicModal from "./modal";
import BackendInteractor from "../../app/api";
import { useAuth } from "../../app/context/AuthProvider";
import { useMutation } from "react-query";
import { TMovie } from "../../interface";

const ButtonAddMovie: React.FC<{
  setMovies: React.Dispatch<React.SetStateAction<TMovie[]>>;
}> = ({ setMovies }) => {
  const { token } = useAuth();
  const backendInteractor = new BackendInteractor(token);
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
          <input type="text" placeholder="Title" {...getFieldProps("title")} />
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
  );
};
export default ButtonAddMovie;
