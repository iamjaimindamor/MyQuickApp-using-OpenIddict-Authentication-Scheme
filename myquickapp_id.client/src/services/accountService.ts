import { AxiosError } from "axios";
import IAuthenticationDetails, { ILogin } from "../types/auth.types";
import { PUBLIC_ACCESS_PATH, USER_AUTH_PATH } from "../routes/allroutes";
import { axiosInstance } from "../utils/axiosInstance";

export const login = async (data: ILogin) => {
  try {
    const response = await axiosInstance.post(
      PUBLIC_ACCESS_PATH.LOGIN_USER,
      data
    );
    if (response.status === 200) {
      return response;
    }
  } catch (error: AxiosError | any) {
    return error.response;
  }
};

export const CheckisUniqueUsername = async (username: string) => {
  try {
    const response = await axiosInstance.get(
      PUBLIC_ACCESS_PATH.VITE_USERNAME_URL + `${username}`
    );

    if (response.status === 200) {
      return response;
    }
  } catch (error: AxiosError | any) {
    return error.response;
  }
};

export const CheckisUniqueEmail = async (email: string) => {
  try {
    const response = await axiosInstance.get(
      PUBLIC_ACCESS_PATH.VITE_EMAIL_URL + `${email}`
    );

    if (response.status === 200) {
      return response;
    }
  } catch (error: AxiosError | any) {
    return error.response;
  }
};

export const SignUp = async (data: IAuthenticationDetails) => {
  try {
    const response = await axiosInstance.post(
      PUBLIC_ACCESS_PATH.VITE_CREATE_USER_URL,
      data
    );

    if (response.status === 200) {
      return response;
    }
  } catch (error: AxiosError | any) {
    throw error;
  }
};

export const SignOut = async () => {
  try {
    const response = await axiosInstance.get(
      USER_AUTH_PATH.LOGOUT_CURRENT_USER
    );

    if (response.status === 200) {
      return response;
    }
  } catch (error: AxiosError | any) {
    throw error;
  }
};
