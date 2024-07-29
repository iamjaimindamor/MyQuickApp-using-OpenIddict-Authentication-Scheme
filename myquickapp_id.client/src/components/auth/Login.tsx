import { Button, Checkbox, InputAdornment, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import plant from "../../assets/plant-final.png";
import sunset from "../../assets/sunset.png";
import { useAppSelector } from "../../hooks/hook";
import { CheckAuth } from "../../user/authenticationSlice";
import toast from "react-hot-toast";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { ILogin } from "../../types/auth.types";
import { OidcLogin } from "../../services/AuthService";
import { SetForceUpdate } from "../../user/forceUpdateSlice";
import { isAxiosError } from "axios";

function Login() {
  const dispatch = useDispatch();
  const alreadyAuthenticated = useSelector(
    (state: RootState) => state.checkauthReducer.isAuthenticated
  );
  const CURRENT_USER = useAppSelector(
    (state: RootState) => state.auth.userName
  );

  const navigate = useNavigate();
  const {
    register,
    formState: { errors, dirtyFields },
    handleSubmit,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const [visiblity, SetVisibility] = useState(false);
  const [formCheck, SetFormCheck] = useState(true);
  const [remember, SetRememberState] = useState(false);

  const handleButtonColor = () => {
    const errorUndefined = Object.values(errors).every(
      (err) => err == undefined
    );
    errorUndefined && dirtyFields.username && dirtyFields.password
      ? SetFormCheck(true)
      : SetFormCheck(false);
  };

  const handleLoginAPICall = async (data: ILogin) => {
    const response = await OidcLogin(data);
    if (response.status == 200) {
      dispatch(CheckAuth({ isAuthenticated: true }));
      dispatch(SetForceUpdate());
      toast.success("Signed In");
      toast.loading("Redirecting To Welcome Page", { duration: 1250 });
      setTimeout(() => {
        navigate(`/${data.username}`);
      }, 1250);
    } else if (isAxiosError(response)) {
      console.log(response);
      if (
        response.response?.status === 400 &&
        response.response.data.includes("Invalid")
      ) {
        toast.error("Invalid Credentials", { duration: 1950 });
      } else if (
        response.response?.status === 400 &&
        response.response.data.includes("User Blocked")
      ) {
        toast.error("USER BLOCKED", { duration: 1950 });
      } else if (
        response.response?.status == 400 &&
        response.response.data.includes("Confirm")
      ) {
        setTimeout(() => {
          navigate("/Email-Confirmation");
        });
      } else if (response.response?.status === 400) {
        toast.error("Bad Request Occured. Contact Admin", { duration: 1950 });
      }
    }
  };

  useEffect(() => {
    (() => {
      toast("Username: admindemo \n Password : Admin@123", {
        position: "top-right",
        duration: 6500,icon: '😎',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        }
      });

      toast("Username: userdemo \n Password : User@123", {
        position: "top-right",
        duration: 6500,icon: '👻',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        }
      });
    })();

    if (alreadyAuthenticated) {
      navigate(`/${CURRENT_USER}`);
    }
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-md-3">
          <Link to="/">
            <img src={plant} className="welcome"></img>
          </Link>
        </div>
        <div className="col-md-6">
          <form
            className="d-flex justify-content-center"
            onSubmit={handleSubmit((data) => {
              handleLoginAPICall(data);
            })}
            onFocus={handleButtonColor}
            onKeyUp={handleButtonColor}
          >
            <div className="container form">
              <div className="row-md-6">
                <h3 className="display-2 d-flex justify-content-center">
                  Sign In!
                </h3>
                <TextField
                  {...register("username", {
                    required: "username is Required",
                    minLength: { value: 3, message: "Min. Char. Length is 4" },
                    maxLength: {
                      value: 20,
                      message: "Max. Char. Limit Reached",
                    },
                    pattern: {
                      value: /^[A-Za-z][A-Za-z0-9_]{3,20}$/,
                      message: "Only Character , digits ,'_' are allowed",
                    },
                  })}
                  autoComplete="username"
                  label="Username"
                  className="error"
                  id="UserName1"
                  margin="dense"
                  required
                  fullWidth
                  error={errors.username != undefined}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {errors.username == undefined &&
                          dirtyFields.username && <span>&#x2705;</span>}
                      </InputAdornment>
                    ),
                  }}
                />
                <span className="error">{errors.username?.message}</span>

                <TextField
                  type={visiblity ? "text" : "password"}
                  {...register("password", {
                    required: "Password is Required",
                    minLength: { value: 6, message: "Min. Char. Lenght is 6" },
                    maxLength: {
                      value: 20,
                      message: "Max. Char. Length Reached",
                    },
                    pattern: {
                      value:
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/,
                      message:
                        "Must Contains Atleast One digit, One UpperCase Letter and One Small Letter",
                    },
                  })}
                  autoComplete="current-password"
                  label="Password"
                  className="error"
                  id="password"
                  margin="dense"
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <>
                        <InputAdornment position="end">
                          {visiblity ? (
                            <VisibilityIcon
                              onClick={() => {
                                SetVisibility(!visiblity);
                              }}
                            />
                          ) : (
                            <VisibilityOffIcon
                              onClick={() => {
                                SetVisibility(!visiblity);
                              }}
                            />
                          )}
                        </InputAdornment>
                        <InputAdornment position="end">
                          {errors.password == undefined &&
                            dirtyFields.password && <span>&#x2705;</span>}
                        </InputAdornment>
                      </>
                    ),
                  }}
                  error={errors.password != undefined}
                />
                <span className="error">{errors.password?.message}</span>
                <br />
                <Link to="/Reset-Request">
                  <span>
                    <pre className="forget">Forget Password ?</pre>
                  </span>
                </Link>
                <span className="remember">
                  <Checkbox
                    {...register("rememberMe")}
                    onChange={() => {
                      SetRememberState(!remember);
                    }}
                    checked={remember}
                    aria-label="Remember Me"
                  />
                  Remember Me
                </span>
                <div className="formbutton">
                  <p>
                    Not a user ? <Link to="/Register">sign up</Link>
                  </p>
                  <Button
                    color={formCheck ? "success" : "error"}
                    fullWidth
                    variant="outlined"
                    type="submit"
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="col-md-3">
          <Link to="/">
            <img src={sunset} className="bird"></img>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Login;
