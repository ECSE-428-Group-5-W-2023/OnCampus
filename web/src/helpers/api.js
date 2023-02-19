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

  test = async (token) => {
    return (await (await this.init(token)).get("/api/example")).data;
  };

  createEvent = async (token, title, description, is_recurring, is_private, start_date, end_date) => {
    return (await this.init(token)).post("/api/event", {
      title,
      description,
      is_recurring,
      is_private,
      start_date,
      end_date,
    });
  };

  getEvents = async (token) => {
    return (await (await this.init(token)).get("/api/event")).data;
  }
}
