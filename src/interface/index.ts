export type Await<T> = T extends PromiseLike<infer U> ? U : T

export type TAuthPayload = {
    email: string;
    password: string;
  };