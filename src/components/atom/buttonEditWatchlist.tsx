import React, { useEffect, useState } from "react";
import { Option } from "react-multi-select-component";
import { useMutation } from "react-query";
import { useFormik } from "formik";
import _ from "lodash";
import * as Yup from "yup";

import EditIcon from "@mui/icons-material/Edit";

import BasicModal from "./modal";
import { WatchlistButton } from "../../styles/molekul/watchlist.element";
import { TMovie, TWatchlist } from "../../interface";
import {
  InputWrapper,
  StyledMultiSelect,
} from "../../styles/atom/form.element";
import { useAuth } from "../../app/context/AuthProvider";
import BackendInteractor from "../../app/api";
import { InputLabel } from "@mui/material";

const ButtonEditWatchlist: React.FC<{
  setWatchlist: React.Dispatch<React.SetStateAction<TWatchlist[]>>;
  watchlistIndex: number;
  watchlist: TWatchlist;
  movies: TMovie[];
}> = ({ watchlistIndex, watchlist, movies, setWatchlist }) => {
  const {
    id: watchlistId,
    name: watchlistName,
    movies: currentMovies,
  } = watchlist;

  const { token } = useAuth();

  const backendInteractor = new BackendInteractor(token);

  const [selectedAdd, setSelectedAdd] = useState<Option[]>([]);
  const [addOption, setAddOption] = useState<Option[]>([]);
  const [selectedRemove, setSelectedRemove] = useState<Option[]>([]);
  const [removeOption, setRemoveOption] = useState<Option[]>([]);

  const [isPayloadSettled, setIsPayloadSettled] = useState(false);

  useEffect(() => {
    for (const movie of movies) {
      const disabled = !!_.find(currentMovies, { id: movie.id });
      const optionPayload = {
        value: movie.id,
        label: movie.title,
      };
      setAddOption((prevValue) => {
        const newValue = [...prevValue];
        newValue.push({ ...optionPayload, disabled });
        return newValue;
      });
      setRemoveOption((prevValue) => {
        const newValue = [...prevValue];
        newValue.push({ ...optionPayload, disabled: !disabled });
        return newValue;
      });
    }
    setIsPayloadSettled(true);
  }, []);

  const { handleSubmit, getFieldProps, setFieldValue } = useFormik({
    initialValues: {
      id: watchlistId,
      name: watchlistName,
      add: [] as number[],
      remove: [] as number[],
    },
    validationSchema: Yup.object({
      name: Yup.string(),
      add: Yup.array().of(Yup.number()),
      remove: Yup.array().of(Yup.number()),
    }),
    onSubmit: (values, { resetForm, setFieldValue }) => {
      editWatchlist(values);
      resetForm();
      setFieldValue("name", values.name);
      setSelectedAdd([]);
      setSelectedRemove([]);
    },
  });
  const { mutate: editWatchlist, isLoading } = useMutation(
    async (payload: {
      id: number;
      name: string;
      add: number[];
      remove: number[];
    }) => backendInteractor.updateWatchlist(payload),
    {
      async onSuccess({ message }: { message: string }, variables) {
        let removeMovies: TMovie[] = [];
        let addMovies: TMovie[] = [];
        if (variables.remove.length > 0) {
          removeMovies = _.filter(movies, (item) =>
            _.includes(variables.remove, item.id)
          );
        }
        if (variables.add.length > 0) {
          addMovies = _.filter(movies, (item) =>
            _.includes(variables.add, item.id)
          );
        }
        setWatchlist((prevValue) => {
          const newValue = [...prevValue];

          const modifyWatchlist = newValue[watchlistIndex];
          const watclistMovies = modifyWatchlist.movies;

          if (variables.name && variables.name.length > 0)
            modifyWatchlist.name = variables.name;

          for (const removeMovie of removeMovies) {
            const removeIndex = _.findIndex(watclistMovies, {
              id: removeMovie.id,
            });
            modifyWatchlist.movies.splice(removeIndex, 1);
          }
          if (addMovies.length > 0) modifyWatchlist.movies.push(...addMovies);

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
    <BasicModal
      CustomeButton={({ onClick }) => {
        return (
          <WatchlistButton onClick={onClick}>
            <EditIcon style={{ fill: "green" }} />
          </WatchlistButton>
        );
      }}
    >
      {isPayloadSettled ? (
        (() => {
          return (
            <>
              <h3>{watchlistName}</h3>
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p>Edit Watchlist</p>
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    {...getFieldProps("name")}
                    style={{ width: "100%" }}
                  />
                </div>
                <InputWrapper>
                  <InputLabel>Add</InputLabel>
                  <StyledMultiSelect
                    options={addOption}
                    value={selectedAdd}
                    onChange={(changedValue: Option[]) => {
                      setSelectedAdd(changedValue);
                      setFieldValue("add", _.map(changedValue, "value"));
                    }}
                    labelledBy="Select Movies"
                    data-placeholder="Select Movies"
                  />
                </InputWrapper>
                <InputWrapper>
                  <InputLabel>Remove</InputLabel>
                  <StyledMultiSelect
                    options={removeOption}
                    value={selectedRemove}
                    onChange={(changedValue: Option[]) => {
                      setSelectedRemove(changedValue);
                      setFieldValue("remove", _.map(changedValue, "value"));
                    }}
                    labelledBy="Select Movies"
                    data-placeholder="Select Movies"
                  />
                </InputWrapper>
                <button
                  type="submit"
                  style={{ margin: 5 }}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading" : "Submit"}
                </button>
              </form>
            </>
          );
        })()
      ) : (
        <></>
      )}
    </BasicModal>
  );
};
export default ButtonEditWatchlist;
