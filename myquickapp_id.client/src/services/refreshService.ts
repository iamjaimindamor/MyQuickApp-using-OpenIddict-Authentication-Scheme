import toast from "react-hot-toast";
import { OidcRefresh, SessionTimeCount } from "./AuthService";

export const sessionManager = (token: string) => {
  var expires_in = SessionTimeCount(token);
  console.log("Remaning Session Time in seconds : ", expires_in);
  if (expires_in != null) {
    setTimeout(() => {
      (async () => {
        try {
          await refreshService(`${localStorage.getItem("refresh_token")}`);
        } catch (error) {
          return error;
        }
      })();
    }, expires_in * 1000);
  }
};

export const refreshService = async (refreshToken: string | null) => {
  if (refreshToken != null) {
    var response = await OidcRefresh(refreshToken);

    if (response.status == 200) {
      (() => {
        sessionManager(`${localStorage.getItem("id_token")}`);
      })();

      console.log("Session Renewed");
      toast.success("Session Renewed");
      return response;
    }
  } else {
    console.log("Session Expired");
    toast.error("Session Expired");
    return response;
  }
};
