import { useAppSelector } from "../hooks/hook";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

function AuthErrorHandler() {
  const navigate = useNavigate();
  const [AuthState, SetAuthState] = useState<boolean>(false);
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.checkauthReducer.isAuthenticated
  );

  useEffect(() => {
    AuthCheck();
  }, []);

  const AuthCheck = () => {
    if (isAuthenticated) {
      SetAuthState(true);
      toast.loading("Forbidden Action! ", { duration: 1950 });
      setTimeout(() => {
        navigate(`/User`);
      }, 2000);
    } else {
      SetAuthState(false);
      localStorage.clear();
      toast.loading("Unauthorized Action!", { duration: 1950 });
      setTimeout(() => {
        navigate(`/Login`);
      }, 2000);
    }
  };

  if (AuthState) {
    return (
      <>
        <pre>
          <h5 className="login_error">403 : FORBIDDEN</h5>
        </pre>
      </>
    );
  }

  return (
    <>
      <pre>
        <h5 className="login_error">401 : UNAUTHORIZED ACCESS</h5>
      </pre>
    </>
  );
}

export default AuthErrorHandler;
