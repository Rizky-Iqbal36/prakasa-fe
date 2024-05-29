export type Await<T> = T extends PromiseLike<infer U> ? U : T;

export type TAuthPayload = {
  email: string;
  password: string;
};

export type TMovie = {
  id: number;
  title: string;
  studio: string;
  thumbnail: string;
};

export type TWatchlist = { id: number; name: string; movies: TMovie[] };
