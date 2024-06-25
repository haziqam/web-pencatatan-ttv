import axios from "axios";
const port = import.meta.env.EXPRESS_PORT ?? 3000;

const axiosInstance = axios.create({
  baseURL: `http://localhost:${port}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
