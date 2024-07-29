import { Button, Chip, CircularProgress, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import SideBar from "../components/dashboard/SideBar";
import IAuthenticationDetails, {
  AssignRole,
  IBlockUser,
  Roles,
} from "../types/auth.types";
import { initialRoles, initialState } from "../user/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { SetForceUpdate } from "../user/forceUpdateSlice";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { RootState } from "../store";
import {
  All_Roles,
  DeleteUser,
  FetchUser,
  RemoveRole,
  RoleAssignment,
  UserBlocking,
} from "../services/adminServices";
import { CheckAdminAccess } from "../utils/authUtils";

const Edit = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const CURRENT_USER = useAppSelector(
    (state: RootState) => state.auth.userName
  );
  const hasAccess = CheckAdminAccess();
  const [loading, SetLoading] = useState(false);
  const [roleList, SetRoleList] = useState<Roles[]>([initialRoles]);
  const [user, SetUser] = useState<IAuthenticationDetails>(initialState);
  const { username } = useParams();
  const { register, handleSubmit } = useForm<AssignRole>({
    mode: "onChange",
    defaultValues: {
      username: "",
      rolename: "",
    },
  });

  const handleUserandRolesList = async () => {
    SetLoading(true);
    if (hasAccess) {
      const getRoles = await All_Roles();
      const res = await FetchUser(username!);
      if (res.status == 400) {
        setTimeout(() => {
          navigate("/Admin");
        }, 1000);
      }

      if (res.status === 200) {
        console.log(`${username}'s Data Fetched by ${CURRENT_USER}`);
        SetUser(res.data);
      }

      SetRoleList(getRoles.data);
      setTimeout(() => {
        SetLoading(false);
      }, 1098);
    }
  };

  const handleRoleDelete = async (role: string) => {
    if (hasAccess) {
      const res = await RemoveRole(user.userName, role);

      if (res.status === 200) {
        console.log(
          `${user.userName}'s Access For ${role} removed by ${CURRENT_USER}`
        );
        dispatch(SetForceUpdate());
      }
    }
  };

  const handleRoleAssignment = async (data: AssignRole) => {
    if (hasAccess) {
      const res = await RoleAssignment(data);

      if (res.status === 200) {
        console.log(
          `Role of ${data.rolename} Assigned to ${data.username} by ${CURRENT_USER}`
        );
        dispatch(SetForceUpdate());
      }
    }
  };

  const handleRoleDeleteToast = async (item: string) => {
    toast.promise(handleRoleDelete(item), {
      loading: `Removing Role`,
      success: `${item} Access Removed`,
      error: "Role Removal Failed",
    });
  };

  const handleRoleToast = async (data: AssignRole) => {
    toast.promise(handleRoleAssignment(data), {
      loading: "Assigning Role",
      success: "Role Assigned",
      error: "Assignment Failed",
    });
  };

  const USER_DELETE_API = async (UniqueId: string) => {
    if (hasAccess) {
      const res = await DeleteUser(UniqueId);
      if (res.status === 200) {
        navigate("/Admin");
        dispatch(SetForceUpdate());
      }
    }
  };

  const handleUserDelete = async (UID: string, Username: string) => {
    toast.promise(USER_DELETE_API(UID), {
      loading: `Deleting User : ${Username}`,
      success: `${Username} Deleted`,
      error: `Account Deletion Failed. Try Again!`,
    });
  };

  const BLOCK_USER = async (data: IBlockUser) => {
    if (hasAccess) {
      const res = await UserBlocking(data);

      if (res.status == 200) {
        dispatch(SetForceUpdate());
      }
    }
  };

  const handleBlocking = async (data: IBlockUser) => {
    await BLOCK_USER(data);
    if (data.value) {
      toast("User Blocked");
    } else {
      toast.success("User Un-Blocked");
    }
  };

  useEffect(() => {
    handleUserandRolesList();
  }, []);

  if (loading && !hasAccess) {
    navigate("/User/Forbidden");
    return (
      <>
        <SideBar />
        <div className="col-md-11 welcome_div_mobile d-flex justify-content-center ">
          <CircularProgress className="protectedProgress" color="primary" />
        </div>
      </>
    );
  }
  return (
    <>
      <SideBar />
      <h3 className="display-3 edit">Manage User</h3>
      <hr />
      <div className="row-md-11 d-flex admin">
        <div className="col-md-6 edit">
          <div className="row">
            <TextField
              id="uniqueID"
              margin="dense"
              label={"UniqueId"}
              value={user.uniqueID}
              disabled
            />
          </div>
          <div className="row">
            <TextField
              margin="dense"
              id="firstname"
              label={"Firstname"}
              value={user.firstname}
              disabled
            />
          </div>
          <div className="row">
            <TextField
              margin="dense"
              id="lastname"
              label="Lastname"
              value={user.lastname}
              disabled
            />
          </div>
          <div className="row">
            <TextField
              margin="dense"
              id="userName"
              label="Username"
              value={user.userName}
              autoComplete="username"
              disabled
            />
          </div>
          <div className="row">
            <TextField
              autoComplete="email"
              margin="dense"
              id="email"
              label="email"
              value={user.email}
              disabled
            />
          </div>
          <div className="row">
            <TextField
              margin={"dense"}
              id="phoneNumber"
              label="Phonenumber"
              value={
                user.phoneNumber == null ? "Not Provided" : user.phoneNumber
              }
              disabled
            />
          </div>
          <br />
          <pre>
            <i>User Created At : {user.createdAt}</i>
          </pre>
          {user.modifiedAt == null ? (
            ""
          ) : (
            <pre>
              <i>Last Modified At : {user.modifiedAt}</i>
            </pre>
          )}
        </div>
        <div className="vl edit_form" />
        <div className="col-md-5 role">
          <div className="row">
            <div className="assignrole_div">
              <form
                id="role_form"
                onSubmit={handleSubmit((data: AssignRole) => {
                  data.username = `${user.userName}`;
                  handleRoleToast(data);
                })}
              >
                <select
                  {...register("rolename", { required: "Select a role" })}
                  className="form-select roledropdown"
                  id="rolelist"
                  defaultValue="Select a Role"
                >
                  <option value={""}>Select A Role</option>
                  {roleList.map((item: Roles, index: number) => (
                    <option key={item.id + index} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <br />
                <Button
                  variant="outlined"
                  type="submit"
                  color="primary"
                  fullWidth
                >
                  Assign Role
                </Button>
              </form>
            </div>

            <pre className="h4 current_roles">
              <b>
                {">"} Current Roles Of {user.firstname}
              </b>
            </pre>
            <hr />

            <div key={user.uniqueID + "currentrole"}>
              {user.rolesList.map((item: string, index: number) => (
                <span className="chip" key={index + "span"}>
                  <Chip
                    key={index + user.uniqueID}
                    label={item}
                    onDelete={() => handleRoleDeleteToast(item)}
                  />
                </span>
              ))}
            </div>
            <div className="delete_user">
              <form id="delete_user">
                <pre className="h4">
                  <b>{">"} Delete User</b>
                </pre>
                <hr />
                <pre className="error">
                  <b>
                    Userdata will be Deleted from the Database and{" "}
                    {user.firstname} will Lose Access To Site
                  </b>
                </pre>
                <Button
                  className="adminedit"
                  variant="outlined"
                  color="warning"
                  fullWidth
                  onClick={() => {
                    handleUserDelete(user.uniqueID, user.userName);
                  }}
                >
                  Delete {user.firstname}'s Account
                </Button>
              </form>
            </div>
            {CURRENT_USER === user.userName ? (
              ""
            ) : (
              <div>
                <pre className="bloc_del">OR</pre>
                <form>
                  <label className="form-check-label">
                    <pre className="h4 block_message">
                      <b>{">"} Block User! User Will Temporarily Lose Access</b>
                      <hr />
                    </pre>
                  </label>
                  <div className="form-check form-switch d-flex justify-content-left">
                    <div>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault"
                        color="warning"
                        checked={user.isBlocked}
                        onChange={() =>
                          handleBlocking({
                            username: `${user.userName}`,
                            value: !user.isBlocked,
                          })
                        }
                      />{" "}
                      <span>
                        {user.isBlocked ? (
                          <pre className="inactive">
                            <i>User Blocked</i>{" "}
                          </pre>
                        ) : (
                          <pre className="active">
                            <i>User is Active</i>
                          </pre>
                        )}
                      </span>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit;
