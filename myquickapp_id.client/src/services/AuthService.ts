import { ILogin, IUser } from "../types/auth.types";
import { decodeIdentityToken } from "./JwtHelper";
import { OidcRefreshLoginService, OidcService } from "./OidcService";
import { axiosInstance } from "../utils/axiosInstance";
import { AxiosError } from "axios";
import { sessionManager } from "./refreshService";

export const OidcLogin = async (data: ILogin) => {
  try {
    const loginResponse = await OidcService(data);
    const access_token = loginResponse.data.access_token;
    const id_token = loginResponse.data.id_token;
    const refresh_token = loginResponse.data.refresh_token;
    const expires_in = loginResponse.data.expires_in;
    var CURRENT_USER_ID_TOKEN = decodeIdentityToken(id_token);

    const User: IUser = {
      uniqueID: CURRENT_USER_ID_TOKEN.sub,
      Username: CURRENT_USER_ID_TOKEN.username,
      Email: CURRENT_USER_ID_TOKEN.email,
      Roles: CURRENT_USER_ID_TOKEN.role,
    };

    if (access_token != null) {
      sessionManager(id_token);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    } else {
      delete axiosInstance.defaults.headers.common.Authorization;
      localStorage.clear();
    }

    localStorage.setItem("user", JSON.stringify(User));
    localStorage.setItem("user_email", CURRENT_USER_ID_TOKEN.email);
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("id_token", id_token);
    localStorage.setItem("expires_in", expires_in);

    return loginResponse;
  } catch (error: AxiosError | any) {
    console.log(error);
    return error;
  }
};

export const OidcRefresh = async (refresh: string) => {
  localStorage.clear();
  try {
    const refreshLogin = await OidcRefreshLoginService(refresh);
    const access_token = refreshLogin.data.access_token;
    const id_token = refreshLogin.data.id_token;
    const refresh_token = refreshLogin.data.refresh_token;
    const expires_in = refreshLogin.data.expires_in;

    var CURRENT_USER_ID_TOKEN = decodeIdentityToken(id_token);

    const User: IUser = {
      uniqueID: CURRENT_USER_ID_TOKEN.sub,
      Username: CURRENT_USER_ID_TOKEN.username,
      Email: CURRENT_USER_ID_TOKEN.email,
      Roles: CURRENT_USER_ID_TOKEN.role,
    };

    if (access_token != null) {
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    } else {
      localStorage.clear();
      delete axiosInstance.defaults.headers.common.Authorization;
    }
    localStorage.setItem("user", JSON.stringify(User));
    localStorage.setItem("user_email", CURRENT_USER_ID_TOKEN.email);
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("id_token", id_token);
    localStorage.setItem("expires_in", expires_in);

    return refreshLogin;
  } catch (error: AxiosError | any) {
    console.log(error);
    return error;
  }
};

export const isSessionExpired = (token: string) => {
  var CURRENT_USER_ID_TOKEN = decodeIdentityToken(token);

  var date = new Date(0);
  date.setMilliseconds(CURRENT_USER_ID_TOKEN.exp);

  var CURRENT_TIME = new Date();

  return CURRENT_TIME.getTime() / 1000 > date.valueOf();
};

export const SessionTimeCount = (token: string) => {
  var CURRENT_USER_ID_TOKEN = decodeIdentityToken(token);

    var date = new Date(0);
    date.setMilliseconds(CURRENT_USER_ID_TOKEN.exp);
    
    var CURRENT_TIME = new Date();
    var RetainingSession = date.valueOf() - CURRENT_TIME.getTime()/1000 ;
  if (RetainingSession > 0) {
    return RetainingSession;
  } else {
    return null;
  }
};

export const Logout = () => {
  localStorage.clear();
  return true;
};
