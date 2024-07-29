import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/hook";
import { CheckAuth } from "../../user/authenticationSlice";
import { Logout } from "../../services/AuthService";

const LogOut = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    Logout();
    dispatch(CheckAuth({ isAuthenticated: false }));
    toast.loading("Redirecting to login", { duration: 1950 });
  }, []);

  setTimeout(() => {
    navigate("/Login");
  }, 1950);

  return (
    <div className="login_error">
      <pre>
        <b>USER LOGGED OUT</b>
      </pre>
    </div>
  );
};

export default LogOut;
