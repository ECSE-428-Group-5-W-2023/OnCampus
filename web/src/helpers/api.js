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
    is_private,
    event_tags,
    r_rule,
    ex_date,
    all_day,
    start_date,
    end_date,
    group_id
  ) => {
    return (await this.init(token)).post("/api/event", {
      title,
      description,
      is_private,
      event_tags,
      r_rule,
      ex_date,
      all_day,
      start_date,
      end_date,
      group_id,
    });
  };

  getEvents = async (token, group_id) => {
    return (
      await (
        await this.init(token)
      ).get("/api/event", {
        params: {
          group_id,
        },
      })
    ).data;
  };

  deleteEvent = async (token, id) => {
    return (await this.init(token)).delete(`/api/event?id=${id}`);
  };

  editEvent = async (
    token,
    id,
    title,
    description,
    is_private,
    event_tags,
    r_rule,
    ex_date,
    all_day,
    start_date,
    end_date
  ) => {
    return (await this.init(token)).put(`/api/event?id=${id}`, {
      title,
      description,
      is_private,
      event_tags,
      r_rule,
      ex_date,
      all_day,
      start_date,
      end_date,
    });
  };

  createProfile = async (token, email, name, username, school, bio) => {
    return (await this.init(token)).post("/api/profile", {
      email,
      name,
      username,
      school,
      bio,
    });
  };

  getProfile = async (token) => {
    return (await (await this.init(token)).get("/api/profile")).data;
  };

  createFriendship = async (token, usernameFriend) => {
    return (await this.init(token)).post("/api/friendship", null, {
      params: {
        usernameFriend,
      },
    });
  };

  getFriend = async (token, usernameFriend) => {
    return (await this.init(token)).get("/api/friendship", {
      params: {
        usernameFriend,
      },
    });
  };

  getFriendsEvents = async (token, usernameFriend) => {
    return (
      await (
        await this.init(token)
      ).get("/api/friendship/events", {
        params: {
          usernameFriend,
        },
      })
    ).data;
  };

  deleteFriendship = async (token, usernameFriend) => {
    return (await this.init(token)).delete("/api/friendship", {
      params: {
        usernameFriend,
      },
    });
  };

  deleteFriendship = async (token, usernameFriend) => {
    return (await this.init(token)).delete("/api/friendship", {
      params: {
        usernameFriend,
      },
    });
  };

  getFriendGroups = async (token) => {
    return (await (await this.init(token)).get("/api/friendGroup")).data;
  };

  createFriendGroup = async (token, name, description) => {
    return (await this.init(token)).post("/api/friendGroup", {
      name,
      description,
    });
  };
  getAllGroups = async (token) => {
    return (await (await this.init(token)).get("/api/friendGroup/all")).data
      .groups;
  };

  getAllUsers = async (token) => {
    return (await (await this.init(token)).get("/api/users")).data.users;
  };
  leaveGroup = async (token, id) => {
    return (await this.init(token)).post(`/api/friendGroup/leave/${id}`);
  };
  joinGroup = async (token, id) => {
    return (await this.init(token)).post(`/api/friendGroup/join/${id}`);
  };

  removeUser = async (token, groupName, username) => {
    return (await this.init(token)).post(`/api/friendGroup/remove/${groupName}/${username}`);
  };
}
