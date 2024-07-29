import { useForm } from "react-hook-form";
import {
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import sunset from "../../assets/sunset.png";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import "../../App.css";
import plant from "./../../assets/plant-final.png";
import {
  CheckisUniqueEmail,
  CheckisUniqueUsername,
  SignUp,
} from "../../services/accountService";

function Register() {
  const navigate = useNavigate();

  const {
    register,
    formState: { errors, dirtyFields },
    watch,
    handleSubmit,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      Firstname: "",
      Lastname: "",
      Email: "",
      UserName: "",
      CurrentPassword: "",
      PhoneNumber: "",
      confirm_password: "",
    },
  });

  const [visiblity, SetVisibility] = useState(false);
  const [formCheck, SetFormCheck] = useState(true);
  const [unique, SetUniqueStatus] = useState(true);
  const [uniqueEmail, SetUniqueEmailStatus] = useState(true);
  const [loadingName, SetLoadingName] = useState(false);
  const [loadingMail, SetLoadingMail] = useState(false);

  const handleButtonColor = () => {
    const errorUndefined = Object.values(errors).every(
      (err) => err == undefined
    );
    errorUndefined &&
    dirtyFields.UserName &&
    dirtyFields.Email &&
    dirtyFields.Firstname &&
    dirtyFields.Lastname &&
    dirtyFields.CurrentPassword &&
    dirtyFields.confirm_password &&
    dirtyFields.PhoneNumber
      ? SetFormCheck(true)
      : SetFormCheck(false);
  };

  const isUniqueName = async (val: string) => {
    SetUniqueStatus(true);
    try {
      SetLoadingName(true);
      var res = await CheckisUniqueUsername(val);
      setTimeout(() => {
        SetLoadingName(false);
        res.data ? SetUniqueStatus(false) : SetUniqueStatus(true);
      }, 1250);
      if (res.data) {
        return false;
      }
    } catch (error) {
      setTimeout(() => {
        SetLoadingName(false);
      }, 1100);
      console.log(error);
    }
  };

  const isUniqueEmail = async (email: string) => {
    SetUniqueEmailStatus(true);
    try {
      SetLoadingMail(true);
      var response = await CheckisUniqueEmail(email);
      setTimeout(() => {
        SetLoadingMail(false);
        response.data
          ? SetUniqueEmailStatus(false)
          : SetUniqueEmailStatus(true);
      }, 1100);

      if (response.data) {
        return false;
      }
    } catch (error) {
      setTimeout(() => {
        SetLoadingMail(false);
      }, 1100);
      console.log(error);
    }
  };

  const HandleSubmit = async (data: any) => {
    try {
      await SignUp(data);
      toast.loading("Redirecting to login...", { duration: 1850 });
      setTimeout(() => {
        navigate("/Login");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const statusToaster = (data: any) => {
    toast.promise(HandleSubmit(data), {
      loading: "Creating Account",
      success: <b>Registration Successfull</b>,
      error: <b>Sign Up Failed!</b>,
    });
  };

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
              statusToaster(data);
            })}
            onFocus={handleButtonColor}
            onKeyUp={handleButtonColor}
          >
            <div className="container form ">
              <h3 className="display-2 d-flex justify-content-center">
                Sign Up!
              </h3>
              <div className="row">
                <div className="col-md-6 col-xs-6 colleft">
                  <TextField
                    {...register("Firstname", {
                      required: "Firstname is Required",
                      minLength: { value: 3, message: "Min. Length Must Be 3" },
                      maxLength: {
                        value: 20,
                        message: "Max. Length Must Be 20",
                      },
                      pattern: {
                        value: /^\w+/,
                        message: "Only Characters Allowed",
                      },
                    })}
                    className="error"
                    margin="dense"
                    label="Firstname"
                    required
                    id="Firstname"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {errors.Firstname == undefined &&
                            dirtyFields.Firstname && <span>&#x2705;</span>}
                        </InputAdornment>
                      ),
                    }}
                    error={errors.Firstname != undefined}
                  />
                  <span className="error">{errors.Firstname?.message}</span>
                </div>
                <div className="col-md-6 colright">
                  <TextField
                    {...register("Lastname", {
                      minLength: {
                        value: 3,
                        message: "Min. Length is 3 Characters",
                      },
                      maxLength: {
                        value: 25,
                        message: "Max. Length 25 char. Limit",
                      },
                      pattern: {
                        value: /^\w+/,
                        message: "Only Characters Are Allowed",
                      },
                    })}
                    className="error"
                    margin="dense"
                    label="Lastname"
                    id="Lastname"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {errors.Lastname == undefined &&
                            dirtyFields.Lastname && <span>&#x2705;</span>}
                        </InputAdornment>
                      ),
                    }}
                    error={errors.Lastname != undefined}
                  />
                  <span className="error">{errors.Lastname?.message}</span>
                </div>
              </div>

              <TextField
                {...register("UserName", {
                  required: "Username is Must",
                  minLength: { value: 3, message: "Min. Length is 3 Char." },
                  maxLength: { value: 20, message: "Max. Char Limit Reached" },
                  pattern: {
                    value: /^[A-Za-z][A-Za-z0-9_]{3,20}$/,
                    message: "Only Character , digits ,'_' are allowed ",
                  },
                  validate: async (val: string) => {
                    var response = await isUniqueName(val);

                    if (response != undefined) {
                      return "Username Already Exists";
                    }
                  },
                })}
                className="error"
                autoComplete="username"
                margin="dense"
                label="Username"
                required
                id="UserName"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {loadingName ? (
                        <CircularProgress size="1rem" disableShrink />
                      ) : (
                        errors.UserName == undefined &&
                        dirtyFields.UserName && <span>&#x2705;</span>
                      )}
                      {!unique && dirtyFields.UserName && <span>&#10060;</span>}
                    </InputAdornment>
                  ),
                }}
                error={errors.UserName != undefined || !unique}
              />
              <span className="error">{errors.UserName?.message}</span>

              <TextField
                {...register("Email", {
                  required: "Email Field Is Required",
                  pattern: /[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}/,
                  validate: async (val: string) => {
                    var response = await isUniqueEmail(val);

                    if (response != undefined) {
                      return "Email Already In Use!";
                    }
                  },
                })}
                className="error"
                margin="dense"
                label="Email"
                required
                id="Email"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {loadingMail ? (
                        <CircularProgress size="1rem" disableShrink />
                      ) : (
                        errors.Email == undefined &&
                        dirtyFields.Email && <span>&#x2705;</span>
                      )}

                      {!uniqueEmail && dirtyFields.Email && (
                        <span>&#10060;</span>
                      )}
                    </InputAdornment>
                  ),
                }}
                error={errors.Email != undefined || !uniqueEmail}
              />
              <span className="error">{errors.Email?.message}</span>

              <TextField
                type={visiblity ? "text" : "password"}
                {...register("CurrentPassword", {
                  required: "Password is Required",
                  minLength: {
                    value: 5,
                    message: "Minimum Length for Password is 5",
                  },
                  pattern: {
                    value:
                      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/,
                    message:
                      "Must Contains Atleast One digit, One UpperCase Letter and One Small Letter",
                  },
                })}
                autoComplete="current-password"
                className="error"
                margin="dense"
                label="Password"
                required
                id="CurrentPassword"
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
                        {errors.CurrentPassword == undefined &&
                          dirtyFields.CurrentPassword && <span>&#x2705;</span>}
                      </InputAdornment>
                    </>
                  ),
                }}
                error={errors.CurrentPassword != undefined}
              />
              <span className="error">{errors.CurrentPassword?.message}</span>

              <TextField
                type={visiblity ? "text" : "password"}
                {...register("confirm_password", {
                  required: "Confirm Password Required",
                  validate: (val: string) => {
                    if (watch("CurrentPassword") != val) {
                      return "Password Do Not Match";
                    }
                  },
                })}
                className="error"
                autoComplete="current-password"
                margin="dense"
                label="Confirm Password"
                required
                id="confirm-password"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {errors.confirm_password == undefined &&
                        dirtyFields.confirm_password && <span>&#x2705;</span>}
                    </InputAdornment>
                  ),
                }}
                error={errors.confirm_password != undefined}
              />
              <span className="error">{errors.confirm_password?.message}</span>

              <TextField
                {...register("PhoneNumber", {
                  maxLength: {
                    value: 10,
                    message: "Number Exceeded 10 Digits",
                  },
                  pattern: {
                    value: /^[0-9]{10}/,
                    message: "Only Numbers Allowed w/o (+91)",
                  },
                })}
                className="error"
                margin="dense"
                label="Phone Number"
                id="PhoneNumber"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {errors.PhoneNumber == undefined &&
                        dirtyFields.PhoneNumber && <span>&#x2705;</span>}
                    </InputAdornment>
                  ),
                }}
                error={errors.PhoneNumber != undefined}
              />
              <span className="error">{errors.PhoneNumber?.message}</span>

              <br />

              <div className="formbutton">
                <p>
                  Already a user ? <Link to="/Login">continue to login</Link>
                </p>
                <Button
                  type="submit"
                  variant="outlined"
                  color={formCheck ? "success" : "error"}
                  fullWidth
                >
                  Sign Up
                </Button>
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

export default Register;
