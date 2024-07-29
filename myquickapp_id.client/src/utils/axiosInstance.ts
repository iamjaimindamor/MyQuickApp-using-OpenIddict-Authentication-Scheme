import axios from "axios";
import { environment as configuration } from "../environment/environment";

export const axiosInstance = axios.create({
  baseURL: configuration(),
});
