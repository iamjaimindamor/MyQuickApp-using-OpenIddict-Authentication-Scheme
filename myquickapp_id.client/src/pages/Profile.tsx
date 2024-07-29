import { Button, InputAdornment, TextField } from "@mui/material";
import SideBar from "../components/dashboard/SideBar";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { RootState } from "../store";
import Logo from "../assets/Home.png";
import Google from "../assets/google.svg";
import { useForm } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-hot-toast";
import { SetForceUpdate } from "../user/forceUpdateSlice";
import { CheckAuth } from "../user/authenticationSlice";
import { useNavigate } from "react-router-dom";
import { IUpdateData } from "../types/auth.types";
import { CheckisUniqueUsername } from "../services/accountService";
import { PasswordResetRequest, UpdateUser } from "../services/userServices";
import { DeleteUser } from "../services/adminServices";
import OpenIDLogo from "../assets/openid.png";

const Profile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [updatePassword, SetUpdateStatus] = useState(false);
  const CURRENT_USER = useAppSelector((state: RootState) => state.auth);
  const [availableUser, SetAvailability] = useState(false);
  const [currentPassVisibile, SetCurrentVisibility] = useState(false);
  const [newPassVisible, SetNewPassVisibility] = useState(false);

  const isNewUserNameUnique = async (val: string) => {
    SetAvailability(false);
    const isAlreadyUser = await CheckisUniqueUsername(val);
    if (isAlreadyUser.data) {
      if (val != CURRENT_USER.userName) {
        return true;
      }
    } else {
      if (val != CURRENT_USER.userName) {
        SetAvailability(true);
      }
    }
  };

  const UpdateToast = (data: IUpdateData) => {
    toast.promise(HandleUpdateForm(data), {
      loading: "Updating User",
      success: "User Updated",
      error: "Update Failed",
    });
  };

  const HandleUpdateForm = async (data: IUpdateData) => {
    const res = await UpdateUser(data, CURRENT_USER.uniqueID);

    if (res.status === 200) {
      dispatch(SetForceUpdate());
    }
  };

  const deleteToast = () => {
    toast.promise(handleDelete(), {
      loading: "Deleting Account",
      success: "User Deleted",
      error: "Deletion Failed",
    });
  };

  const handleDelete = async () => {
    const res = await DeleteUser(CURRENT_USER.uniqueID);

    if (res.status === 200) {
      dispatch(CheckAuth({ isAuthenticated: false }));
      navigate("/Login");
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, dirtyFields },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      firstname: CURRENT_USER.firstname,
      lastname: CURRENT_USER.lastname == null ? "" : CURRENT_USER.lastname,
      userName: CURRENT_USER.userName,
      email: CURRENT_USER.email,
      phoneNumber:
        CURRENT_USER.phoneNumber == null ? "" : CURRENT_USER.phoneNumber,
      currentPassword: "",
      newPassword: "",
      Confirm_Password: "",
    },
  });

  return (
    <>
      <SideBar />
      <div className="col-md-11 welcome_div_mobile">
        <h3 className="display-3">User Profile</h3>
        <hr />
        <div className="update_form">
          <form
            className="up_form"
            style={{ marginRight: "13px" }}
            onSubmit={handleSubmit((data) => {
              UpdateToast(data);
            })}
          >
            <div
              className="col-md-6 name_deets"
              style={{ marginRight: "13px" }}
            >
              <div className="row up_row">
                <span className="up_span">
                  <pre className="up_label">Firstname :</pre>
                </span>
                <TextField
                  {...register("firstname", {
                    required: "First Name is Must",
                    value: CURRENT_USER.firstname,
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
                  fullWidth
                  error={errors.firstname != undefined}
                />
                <span className="error">{errors.firstname?.message}</span>
              </div>
              <div className="row up_row">
                <span className="up_span">
                  <pre className="up_label">Lastname :</pre>
                </span>
                <TextField
                  {...register("lastname", {
                    value:
                      CURRENT_USER.lastname == null
                        ? ""
                        : CURRENT_USER.lastname,
                    pattern: {
                      value: /^\w+/,
                      message: "Only Characters Allowed",
                    },
                  })}
                  fullWidth
                  error={errors.lastname != undefined}
                />
                <span className="error">{errors.lastname?.message}</span>
              </div>
              <div className="row up_row">
                <span className="up_span">
                  <pre className="up_label">Username :</pre>
                </span>
                <TextField
                  {...register("userName", {
                    required: "Username is Must",
                    minLength: { value: 3, message: "Min. Length is 3 Char." },
                    maxLength: {
                      value: 20,
                      message: "Max. Char Limit Reached",
                    },
                    pattern: {
                      value: /^[A-Za-z][A-Za-z0-9_]{3,20}$/,
                      message: "Only Character , digits ,'_' are allowed ",
                    },
                    value: CURRENT_USER.userName,
                    validate: async (val: string) => {
                      const res = await isNewUserNameUnique(val);

                      if (res != undefined) {
                        return "Username Already Taken";
                      }
                    },
                  })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {availableUser && errors.userName == undefined && (
                          <span className="success">&#x2705;</span>
                        )}
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  error={errors.userName != undefined}
                />
                {availableUser && errors.userName == undefined ? (
                  <span className="success">Username Available</span>
                ) : (
                  <span className="error">{errors.userName?.message}</span>
                )}
              </div>
              <div className="row up_row">
                <span className="up_span">
                  <pre className="up_label">Email :</pre>
                </span>
                <TextField
                  {...register("email", { required: true })}
                  fullWidth
                  value={CURRENT_USER.email}
                  disabled
                />
              </div>
              <div className="row up_row">
                <span className="up_span">
                  <pre className="up_label">Phonenumber :</pre>
                </span>
                <TextField
                  {...register("phoneNumber", {
                    value:
                      CURRENT_USER.phoneNumber == null
                        ? ""
                        : CURRENT_USER.phoneNumber,
                    pattern: {
                      value: /^[0-9]{10}/,
                      message: "Only Numbers Allowed w/o (+91)",
                    },
                  })}
                  error={errors.phoneNumber != undefined}
                  fullWidth
                />
                <span className="error">{errors.phoneNumber?.message}</span>
                {CURRENT_USER.phoneNumber == null ||
                ("" && !dirtyFields.phoneNumber) ? (
                  <span className="up_phone">
                    <pre>Add Phone Number</pre>
                  </span>
                ) : (
                  <span></span>
                )}
              </div>
            </div>
            <div className="vl" />
            <div className="col-md-6" style={{ marginLeft: "10px" }}>
              <div className="row up_row">
                {!updatePassword ? (
                  <span className="updatePassword">
                    <Button
                      className="updatePassButton"
                      variant="outlined"
                      onClick={() => {
                        if (CURRENT_USER.loginProvider != null) {
                          toast.error(
                            "Go To Google's Account(Login Provider)",
                            {
                              duration: 2000,
                            }
                          );
                        } else {
                          SetUpdateStatus(true);
                        }
                      }}
                      fullWidth
                    >
                      Change Password
                    </Button>
                  </span>
                ) : (
                  <>
                    <span className="up_span">
                      <pre className="up_label">Current Password :</pre>
                    </span>
                    <TextField
                      {...register("currentPassword", {
                        minLength: {
                          value: 6,
                          message: "Min. Length is 6 Chars",
                        },
                        pattern: {
                          value:
                            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/,
                          message:
                            "Must Contains Atleast One digit, One UpperCase Letter and One Small Letter",
                        },
                      })}
                      error={errors.currentPassword != undefined}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {errors.currentPassword == undefined &&
                              dirtyFields.currentPassword && (
                                <span className="success">&#x2705;</span>
                              )}

                            {currentPassVisibile ? (
                              <VisibilityOff
                                onClick={() => {
                                  SetCurrentVisibility(!currentPassVisibile);
                                }}
                              />
                            ) : (
                              <Visibility
                                onClick={() => {
                                  SetCurrentVisibility(!currentPassVisibile);
                                }}
                              />
                            )}
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      type={currentPassVisibile ? "text" : "password"}
                    />
                    <span className="error">
                      {errors.currentPassword?.message}
                    </span>
                    <span className="up_span">
                      <pre className="up_label">New Password :</pre>
                    </span>
                    <TextField
                      {...register("newPassword", {
                        minLength: {
                          value: 6,
                          message: "Min. Length is 6 Chars",
                        },
                        pattern: {
                          value:
                            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/,
                          message:
                            "Must Contains Atleast One digit, One UpperCase Letter and One Small Letter",
                        },
                      })}
                      error={errors.newPassword != undefined}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {errors.newPassword == undefined &&
                              dirtyFields.newPassword && (
                                <span className="success">&#x2705;</span>
                              )}
                            {newPassVisible ? (
                              <VisibilityOff
                                onClick={() => {
                                  SetNewPassVisibility(!newPassVisible);
                                }}
                              />
                            ) : (
                              <Visibility
                                onClick={() => {
                                  SetNewPassVisibility(!newPassVisible);
                                }}
                              />
                            )}
                          </InputAdornment>
                        ),
                      }}
                      type={newPassVisible ? "text" : "password"}
                      fullWidth
                    />
                    <span className="error">{errors.newPassword?.message}</span>
                    <span className="up_span">
                      <pre className="up_label">Confirm New Password :</pre>
                    </span>
                    <TextField
                      type={newPassVisible ? "text" : "password"}
                      {...register("Confirm_Password", {
                        minLength: {
                          value: 6,
                          message: "Min. Length is 6 Chars",
                        },
                        validate: (val: string) => {
                          if (val != watch("newPassword")) {
                            return "Confirm Password Must Be Same as New Password";
                          }
                        },
                      })}
                      error={errors.Confirm_Password != undefined}
                      fullWidth
                    />
                    <span className="error">
                      {errors.Confirm_Password?.message}
                    </span>
                  </>
                )}
              </div>
              <hr />
              <span className="updatePassword">
                <Button
                  type="submit"
                  style={{ width: "370px", marginLeft: "14px" }}
                  className="updatePassButton "
                  variant="contained"
                  color="success"
                  fullWidth
                >
                  Update User Details
                </Button>
              </span>
              <hr />
              <div className="row up_row">
                <pre className="user_deets">
                  <i>Created At : {CURRENT_USER.createdAt}</i>
                </pre>
                {CURRENT_USER.modifiedAt != null ? (
                  <pre className="user_deets">
                    <i>Modified At : {CURRENT_USER.modifiedAt}</i>
                  </pre>
                ) : (
                  <pre></pre>
                )}
              </div>
            </div>
            <div className="vl" style={{ marginLeft: "5px" }} />
            <span style={{ marginLeft: "20px", width: "200px" }}>
              <pre className="h5">Login Provider</pre>
              <hr />
              {CURRENT_USER.loginProvider == null ? (
                <>
                  <pre className="h5">
                    <img
                      className="loginProvider_Identity"
                      src={Logo}
                      alt="MyQuickApp"
                    />
                    &nbsp; + &nbsp;
                    <img className="openId" src={OpenIDLogo} alt="MyQuickApp" />
                    <br />
                    <span className="h6">Identity  OpenIddict </span>
                  </pre>
                </>
              ) : (
                <>
                  <pre className="h5">
                    <img className="loginProvider" src={Google} alt="Google" />{" "}
                    <span>Google </span>
                  </pre>
                </>
              )}
            </span>
          </form>
          <hr />
          <form className="del_from">
            <h3 className="display-4 d-inline-block">
              <span>
                Forget Password
                <hr />
              </span>
            </h3>
            <h6>
              <pre>
                <strong>Forget The Current Password ?</strong>
                <span> Password Reset Link Will be sent to Email !</span>
              </pre>
            </h6>

            <Button
              style={{ width: "370px", margin: "10px", marginLeft: "2px" }}
              className="updatePassButton "
              variant="outlined"
              onClick={() => {
                if (CURRENT_USER.loginProvider == null) {
                  toast.loading(
                    "Generating Reset Token and sending to your mail",
                    { duration: 1150 }
                  );

                  (async () => {
                    const res = await PasswordResetRequest({
                      username: CURRENT_USER.userName,
                    });

                    if (res.status === 200) {
                      navigate("/Reset-Password");
                    }
                  })();
                } else {
                  toast.error("Go To Google's Account");
                }
              }}
              color="warning"
              fullWidth
            >
              Reset My Password
            </Button>
          </form>
          <hr />
          <form className="del_from">
            <h3 className="display-4 d-inline-block">
              <span>
                Delete My Account
                <hr />
              </span>
            </h3>
            <h6>
              <pre>
                <strong>All Personal Details will removed</strong>
                <span> You'll be logged out from current session!</span>
              </pre>
            </h6>
            <Button
              style={{ width: "370px", margin: "10px", marginLeft: "2px" }}
              className="updatePassButton "
              variant="contained"
              onClick={deleteToast}
              color="error"
              fullWidth
            >
              Delete My Account
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
