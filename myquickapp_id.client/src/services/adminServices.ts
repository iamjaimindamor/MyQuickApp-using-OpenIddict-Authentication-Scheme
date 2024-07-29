import { AxiosError } from "axios";
import { ADMIN_PATH } from "../routes/allroutes";
import { AssignRole, IBlockUser } from "../types/auth.types";
import { axiosInstance } from "../utils/axiosInstance";

export const FetchAllUser = async () => {
  try {
    const response = await axiosInstance.get(ADMIN_PATH.ALL_USR_LIST);
    console.log(response);
    return response;
  } catch (error: AxiosError | any) {
    return error.response;
  }
};

export const DeleteUser = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      ADMIN_PATH.DELETE_USER + `${id}`
    );
    if (response.status === 200) {
      return response;
    }
  } catch (error: AxiosError | any) {
    return error.response;
  }
};

export const All_Roles = async () => {
  try {
    const response = await axiosInstance.get(ADMIN_PATH.ALL_ORGANIZATION_ROLES);
    return response;
  } catch (error: AxiosError | any) {
    return error.response;
  }
};

export const FetchUser = async (username: string) => {
  try {
    const response = await axiosInstance.get(
      ADMIN_PATH.GET_USER_DATA + `${username}`
    );
    return response;
  } catch (error: AxiosError | any) {
    return error.response;
  }
};

export const RoleAssignment = async (data: AssignRole) => {
  try {
    const response = await axiosInstance.post(ADMIN_PATH.ASSIGN_ROLES, data);
    return response;
  } catch (error: AxiosError | any) {
    return error.response;
  }
};

export const RemoveRole = async (username: string, role: string) => {
  try {
    const response = await axiosInstance.delete(
      ADMIN_PATH.DELETE_USER_ROLE + `username=${username}&rolename=${role}`
    );
    return response;
  } catch (error: AxiosError | any) {
    return error.response;
  }
};

export const UserBlocking = async (data: IBlockUser) => {
  try {
    const response = await axiosInstance.post(ADMIN_PATH.BLOCK_USER, data);
    return response;
  } catch (error: AxiosError | any) {
    return error.response;
  }
};
