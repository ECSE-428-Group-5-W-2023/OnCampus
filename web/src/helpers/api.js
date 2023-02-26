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

  createEvent = async (
    token,
    title,
    description,
    is_recurring,
    is_private,
    days_of_week,
    event_frequency,
    event_tags,
    date,
    end_period,
    start_date,
    end_date
  ) => {
    return (await this.init(token)).post("/api/event", {
      title,
      description,
      is_recurring,
      is_private,
      days_of_week,
      event_frequency,
      event_tags,
      date,
      end_period,
      start_date,
      end_date,
    });
  };

  getEvents = async (token) => {
    return (await (await this.init(token)).get("/api/event")).data;
  };

  editEvent = async (
    token,
    id,
    title,
    description,
    is_recurring,
    is_private,
    days_of_week,
    event_frequency,
    event_tags,
    date,
    end_period,
    start_date,
    end_date
  ) => {
    return (await this.init(token)).put(`/api/event?id=${id}`, {
      title,
      description,
      is_recurring,
      is_private,
      days_of_week,
      event_frequency,
      event_tags,
      date,
      end_period,
      start_date,
      end_date,
    });
  };

  // PROFILE

  createProfile = async (
    token,
    id,
    email,
    name,
    username,
    school,
    bio
  ) => {
    return (await this.init(token)).post("/api/profile", {
      email,
      name,
      username,
      school,
      bio,
    });
  };

  updateProfile = async (
    token,
    id,
    email,
    name,
    username,
    school,
    bio
  ) => {
    return (await this.init(token)).put(`/api/profile?id=${id}`, {
      email,
      name,
      username,
      school,
      bio,
    });
  };

//    getProfile = async (token) => {
//        return (await (await this.init(token)).get("/api/profile")).data;
//  };
  getProfile = async (accessToken) => {
    const api = new Api();
    try {
      const response = await api.init(accessToken).get("/api/profile");
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get user profile");
    }
  };

}
