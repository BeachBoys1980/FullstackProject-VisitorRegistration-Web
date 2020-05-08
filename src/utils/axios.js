import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKENDAPIURL || "http://localhost:5000",
  timeout: 1000,
  withCredentials: true,
});

instance.defaults.headers.post["Content-Type"] = "application/json";

export default instance;
