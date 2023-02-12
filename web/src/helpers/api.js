import axios from "axios";

export default class Api {
  client;
  api_token;
  api_url;

  constructor() {
    this.api_token = undefined;
    this.api_url = process.env.REACT_APP_BACKEND_URL;
  }

  init = async (token) => {
    this.api_token = token;

    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${this.api_token}`,
    };

    this.client = axios.create({
      baseURL: this.api_url,
      headers: headers,
    });

    return this.client;
  };

  //Add API calls here
}
