import axios, { AxiosInstance } from "axios";
import appConfig from "../config";
import { TAuthPayload } from "../../interface";

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
      .post(`auth/${mode}`, payload, {
        headers: {
          "content-type": "application/json",
        },
      })
      .then((res) => res.data);
  }

  public async movies(): Promise<
    { id: number; title: string; studio: string; thumbnail: string }[]
  > {
    return this.client.get("movie/list").then((res) => res.data.data);
  }
}

export default BackendInteractor;
