import { Button, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/hook";
import { RootState } from "../store";
import { INewPasswordRequest } from "../types/auth.types";
import { NewPassword } from "../services/userServices";

const ResetPassword = () => {
  const [visiblity, SetVisibility] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.checkauthReducer.isAuthenticated
  );
  const {
    register,
    formState: { errors, dirtyFields },
    watch,
    handleSubmit,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      newPass: "",
      confirm_password: "",
      token: "",
      email: "",
    },
  });

  const handleNewPasswordRequest = async (data: INewPasswordRequest) => {
    const res = await NewPassword(data);

    if (res.status === 200) {
      setTimeout(() => {
        if (isAuthenticated) {
          navigate("/Admin");
        }
        navigate("/Login");
      }, 1250);
    }
  };

  const toastPassword = (data: any) => {
    toast.promise(handleNewPasswordRequest(data), {
      loading: "Resetting Password",
      success: "Password Changed",
      error: "Password Reset Failed",
    });
  };

  return (
    <>
      <div className="reset_form">
        <h3 className="d-flex justify-content-center display-3">
          New Password
        </h3>
        <br />
        <form
          onSubmit={handleSubmit((data) => {
            toastPassword(data);
          })}
        >
          <TextField
            {...register("email", {
              required: "Confirm Password Required",
            })}
            className="error"
            autoComplete="email"
            margin="dense"
            label="Email"
            required
            id="email"
            fullWidth
            error={errors.email != undefined}
          />
          <span className="error">{errors.email?.message}</span>

          <TextField
            type={visiblity ? "text" : "password"}
            {...register("newPass", {
              required: "Password is Required",
              minLength: {
                value: 5,
                message: "Minimum Length for Password is 5",
              },
              pattern: {
                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/,
                message:
                  "Must Contains Atleast One digit, One UpperCase Letter and One Small Letter",
              },
            })}
            autoComplete="current-password"
            className="error"
            margin="dense"
            label="New Password"
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
                </>
              ),
            }}
            error={errors.newPass != undefined}
          />
          <span className="error">{errors.newPass?.message}</span>

          <TextField
            type={visiblity ? "text" : "password"}
            {...register("confirm_password", {
              required: "Confirm Password Required",
              validate: (val: string) => {
                if (watch("newPass") != val) {
                  return "Password Do Not Match";
                }
              },
            })}
            className="error"
            autoComplete="current-password"
            margin="dense"
            label="Confirm New Password"
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
            {...register("token", {
              required: "Confirm Password Required",
            })}
            className="error"
            autoComplete="current-password"
            margin="dense"
            label="Reset Token"
            required
            id="token"
            fullWidth
            error={errors.token != undefined}
          />
          <span className="error">{errors.token?.message}</span>
          <br />
          <br />
          <Button variant="outlined" type="submit" fullWidth>
            RESET PASSWORD
          </Button>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
