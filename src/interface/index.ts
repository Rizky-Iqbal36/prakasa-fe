import BackendInteractor from "../app/api";

export type Await<T> = T extends PromiseLike<infer U> ? U : T

export type TAuthPayload = {
    email: string;
    password: string;
  };

export type TMovie = Await<ReturnType<typeof BackendInteractor.prototype.movies>>[0];