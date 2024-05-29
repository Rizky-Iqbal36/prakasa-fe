import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import appConfig from "../config";
import { TAuthPayload, TMovie, TWatchlist } from "../../interface";

const postOptions: AxiosRequestConfig<any> = {
  headers: {
    "content-type": "application/json",
  },
};

class BackendInteractor {
  public client: AxiosInstance;

  constructor(public accessToken?: string) {
    this.client = axios.create({
      baseURL: appConfig.apis.backendURI,
      ...(accessToken && {
        headers: {
          ["Authorization"]: `Bearer ${accessToken}`,
        },
      }),
    });
  }

  public async auth(mode: "register" | "login", payload: TAuthPayload) {
    return this.client
      .post(`auth/${mode}`, payload, postOptions)
      .then((res) => res.data);
  }

  public async movies(): Promise<TMovie[]> {
    return this.client.get("movie/list").then((res) => res.data.data);
  }

  public async addMovie(payload: any) {
    return this.client
      .post("movie/create", payload, postOptions)
      .then((res) => res.data);
  }

  public async updateMovie({
    movie_id,
    title,
  }: {
    movie_id: number;
    title: string;
  }) {
    return this.client
      .put("movie/update", { movie_id, title }, postOptions)
      .then((res) => res.data);
  }

  public async deleteMovie(id: number) {
    return this.client
      .delete(`movie/${id}`, postOptions)
      .then((res) => res.data);
  }

  public async addWatchlist(payload: any) {
    return this.client
      .post("watchlist/create", payload, postOptions)
      .then((res) => res.data);
  }

  public async watchlist(): Promise<TWatchlist[]> {
    return this.client.get("watchlist").then((res) => res.data.data);
  }

  public async deleteWatchlist(id: number) {
    return this.client
      .delete(`watchlist/${id}`, postOptions)
      .then((res) => res.data);
  }

  public async updateWatchlist({
    id,
    name,
    add,
    remove,
  }: {
    id: number;
    name: string;
    add: number[];
    remove: number[];
  }): Promise<any> {
    return this.client
      .put("watchlist/update", { id, name, add, remove }, postOptions)
      .then((res) => res.data);
  }
}

export default BackendInteractor;
