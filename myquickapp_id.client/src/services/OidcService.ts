import axios from "axios";
import { environment } from "../environment/environment";
import { ILogin } from "../types/auth.types";

export const OidcService = async (LoginData: ILogin) => {
  const Client_Id = "MyQuickApp_ReactClient";
  const scope = "openid email profile roles offline_access";

  const header = { "Content-Type": "application/x-www-form-urlencoded" };
  const data = new URLSearchParams();
  data.append("client_id", Client_Id);
  data.append("grant_type", "password");
  data.append("username", LoginData.username);
  data.append("password", LoginData.password);
  data.append("scope", scope);

  const response = await axios.post(
    environment() + "/connect/token",
    data,
    { headers: header }
  );
  return response;
};

export const OidcRefreshLoginService = async (resfrshLogin: string) => {
  const Client_Id = "MyQuickApp_ReactClient";
  const scope = "openid email profile roles offline_access";

  const header = { "Content-Type": "application/x-www-form-urlencoded" };
  const data = new URLSearchParams();
  data.append("client_id", Client_Id);
  data.append("grant_type", "refresh_token");
  data.append("refresh_token", resfrshLogin);
  data.append("scope", scope);

  var response = await axios.post(
    environment() + "/connect/token",
    data,
    { headers: header }
  );
  return response;
};
