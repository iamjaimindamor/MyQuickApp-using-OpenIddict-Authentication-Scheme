import { Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PasswordResetRequest } from "../services/userServices";
import { IUsername } from "../types/auth.types";

const ResetRequest = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      Username: "",
    },
  });

  const handleResetRequest = async (data: IUsername) => {
    const res = await PasswordResetRequest(data);
    if (res.status === 200) {
      setTimeout(() => {
        navigate("/Reset-Password");
      }, 2500);
    }
  };

  const toastRequest = (data: any) => {
    toast.promise(handleResetRequest(data), {
      loading: "Generating Request",
      success: "Request Sent ! Reset Token Sent To Your Mail",
      error: "Request Failed",
    });
  };

  return (
    <div className="resetReq_form">
      <h3 className="d-flex justify-content-center display-3">
        Request Password Reset
      </h3>
      <br />
      <form
        onSubmit={handleSubmit((data) => {
          toastRequest(data);
        })}
      >
        <TextField
          {...register("Username", {
            required: "Username is Must",
            minLength: { value: 3, message: "Min. Length is 3 Char." },
            maxLength: { value: 20, message: "Max. Char Limit Reached" },
            pattern: {
              value: /^[A-Za-z][A-Za-z0-9_]{3,20}$/,
              message: "Only Character , digits ,'_' are allowed ",
            },
          })}
          className="error"
          autoComplete="username"
          margin="dense"
          label="Username"
          required
          id="Username"
          fullWidth
          error={errors.Username != undefined}
        />
        <span className="error">{errors.Username?.message}</span>
        <br />
        <br />
        <Button variant="outlined" type="submit" fullWidth>
          SENT PASSWORD RESET REQUEST
        </Button>
      </form>
    </div>
  );
};

export default ResetRequest;
