import axios from "axios";

const instance = axios.create({
  timeout: 1000,
  withCredentials: true,
});

instance.defaults.headers.post["Content-Type"] = "application/json";

export default instance;
