import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CheckAuth } from "../user/authenticationSlice";
import { setAuthDetails } from "../user/userSlice";
import SideBar from "../components/dashboard/SideBar";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store";
import { IError, Props } from "../types/auth.types";
import { useAppSelector } from "../hooks/hook";
import { initialState } from "../user/userSlice";
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import { CurrentUser } from "../services/userServices";
import { axiosInstance } from "../utils/axiosInstance";
import { isSessionExpired } from "../services/AuthService";
import { refreshService, sessionManager } from "../services/refreshService";
import { SetForceUpdate } from "../user/forceUpdateSlice";

const ProtectedRoute = ({ children }: Props) => {
  const dispatch = useDispatch();
  const isAlreadyAuthenticated = useAppSelector(
    (state: RootState) => state.checkauthReducer.isAuthenticated
  );
  const [loading, SetLoading] = useState(false);
  const [sessionLoading, SetSessionLoading] = useState(false);
  const [error, SetError] = useState(false);
  const [errorType, SetErrorType] = useState<IError>({
    error: "",
    statuscode: "",
  });

  const GlobalUpdateState = useAppSelector(
    (state: RootState) => state.forceUpdateSlice
  );

  const navigate = useNavigate();

  const CheckAuthentication = async () => {
    SetLoading(true);
    try {
      const res = await CurrentUser();

      if (res.status == 400 || res.status == 401 || res.status == 403) {
        throw res;
      }

      if (res.status === 200) {
        dispatch(CheckAuth({ isAuthenticated: true }));
        dispatch(setAuthDetails(res.data));
        SetLoading(false);
      } else {
        dispatch(CheckAuth({ isAuthenticated: false }));
        localStorage.clear();
        dispatch(setAuthDetails(initialState));
      }
    } catch (res: AxiosError | any) {
      SetError(true);
      if (sessionLoading) {
        SetError(false);
      }

      SetLoading(false);
      if (res.status == 400) {
        SetErrorType({ error: "400", statuscode: "Bad Request" });
      } else if (res.status == 401) {
        SetErrorType({ error: "401", statuscode: "UnAuthorized Access" });
      } else if (res.status == 403) {
        SetErrorType({ error: "403", statuscode: "Forbidden" });
      } else {
        SetErrorType({ error: "", statuscode: "Something Went Wrong" });
      }
    }
  };

  const CheckPreviousSession = async () => {
    SetSessionLoading(true);

    if (localStorage.getItem("id_token") == null) {
      navigate("/User/Forbidden");
    }

    if (isSessionExpired(`${localStorage.getItem("id_token")}`)) {
      var result = await refreshService(
        `${localStorage.getItem("refresh_token")}`
      );

      if (result.status === 200) {
        dispatch(SetForceUpdate());
        SetSessionLoading(false);
      }
    } else if (`${localStorage.getItem("id_token")}` != null) {
      sessionManager(`${localStorage.getItem("id_token")}`);
    }

    if (
      localStorage.getItem("access_token") != null &&
      localStorage.getItem("id_token") != null &&
      !isSessionExpired(`${localStorage.getItem("id_token")}`)
    ) {
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
        "access_token"
      )}`;
    } else {
      delete axiosInstance.defaults.headers.common.Authorization;
    }
  };

  useEffect(() => {
    console.log("Protected Route Accessed.");
    if (
      `${localStorage.getItem("id_token")}` != null &&
      !isAlreadyAuthenticated
    ) {
      CheckPreviousSession();
    }

    CheckAuthentication();
  }, [GlobalUpdateState]);

  if (loading) {
    return (
      <>
        <SideBar />
        <div className="col-md-11 welcome_div_mobile d-flex justify-content-center ">
          <CircularProgress className="protectedProgress" color="primary" />
        </div>
      </>
    );
  } else if (!sessionLoading && error) {
    dispatch(CheckAuth({ isAuthenticated: false }));
    () => toast.loading("Redirecting to Login", { duration: 1950 });
    setTimeout(() => {
      {
        navigate("/Login");
      }
    }, 1950);
    return (
      <div className="login_error">
        <pre>
          <b>
            ERR {errorType.error} : {errorType.statuscode}
          </b>
        </pre>
      </div>
    );
  } else {
    return children;
  }
};

export default ProtectedRoute;
