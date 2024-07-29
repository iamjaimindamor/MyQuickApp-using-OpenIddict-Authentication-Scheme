import axios, { AxiosError } from "axios";
import IAuthenticationDetails, {
  INewPasswordRequest,
  IUpdateData,
  IUsername,
} from "../types/auth.types";
import {
  GET_USER_ACCESS_PATH,
  PUBLIC_ACCESS_PATH,
  USER_AUTH_PATH,
} from "../routes/allroutes";
import { axiosInstance } from "../utils/axiosInstance";
import { environment } from "../environment/environment";

export const CurrentUser = async () => {
  try {
    var access_token = localStorage.getItem("access_token");

    const response: IAuthenticationDetails = await axios.get(
      environment() + USER_AUTH_PATH.CURRENT_USER_AUTH,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    return response;
  } catch (error: AxiosError | any) {
    return error.response;
  }
};

export const UpdateUser = async (data: IUpdateData, UID: string) => {
  try {
    const response = await axiosInstance.put(
      `${GET_USER_ACCESS_PATH.USER_UPDATE_URL + UID}`,
      data
    );

    return response;
  } catch (error: AxiosError | any) {
    return error.response;
  }
};

export const PasswordResetRequest = async (username: IUsername) => {
  try {
    const response = await axiosInstance.post(
      PUBLIC_ACCESS_PATH.RESET_REQUEST,
      username
    );
    return response;
  } catch (error: AxiosError | any) {
    return error.response;
  }
};

export const NewPassword = async (NewPassword: INewPasswordRequest) => {
  try {
    const response = await axiosInstance.post(
      PUBLIC_ACCESS_PATH.NEW_USER_PASSWORD,
      NewPassword
    );

    return response;
  } catch (error: AxiosError | any) {
    return error.response;
  }
};
