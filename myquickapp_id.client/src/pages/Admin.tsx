import { Link, useNavigate } from "react-router-dom";
import SideBar from "../components/dashboard/SideBar";
import { useAppDispatch } from "../hooks/hook";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import IAuthenticationDetails from "../types/auth.types";
import edit from "../assets/edit (1).png";
import delete_icon from "../assets/delete.png";
import { SetForceUpdate } from "../user/forceUpdateSlice";
import { DeleteUser, FetchAllUser } from "../services/adminServices";
import { CheckAdminAccess } from "../utils/authUtils";

const Admin = () => {
  const dispatch = useAppDispatch();
  const [fetching, SetFetchingState] = useState(false);
  const [userList, SetUserList] = useState<IAuthenticationDetails[]>([]);
  const hasAccess = CheckAdminAccess();
  const navigate = useNavigate();

  const GET_ALL_USER = async () => {
    SetFetchingState(true);
    if (hasAccess) {
      const res = await FetchAllUser();
      if (res.status === 200) {
        SetUserList(res.data);
        SetFetchingState(false);
      }
    }
  };

  useEffect(() => {
    GET_ALL_USER();
  }, []);

  const USER_DELETE_API = async (UniqueId: string) => {
    const res = await DeleteUser(UniqueId);

    if (res.status === 200) {
      dispatch(SetForceUpdate());
    }
  };

  const handleUserDelete = async (UID: string, Username: string) => {
    toast.promise(USER_DELETE_API(UID), {
      loading: `Deleting User : ${Username}`,
      success: `${Username} Deleted`,
      error: `Account Deletion Failed. Try Again!`,
    });
  };

    if (!hasAccess) {
    navigate("/User/Forbidden");
    }

  if (fetching) {
    return (
      <>
        <SideBar />
        <div className="col-md-11 welcome_div_mobile">
          <h3 className="display-3 admin">Admin Panel</h3>
          <hr />
          <CircularProgress
            className="admin_fetching"
            color="primary"
            size={60}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <SideBar />
      <div className="col-md-11 welcome_div_mobile">
        <h3 className="display-3 admin">Admin Panel</h3>
        <hr />
        <table className="table">
          <thead className="theader">
            <tr>
              <th>Sr. No.</th>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Username</th>
              <th>Roles</th>
              <th>Login Provider</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((item: IAuthenticationDetails, index: number) => (
              <tr key={index + 1}>
                <td>{index + 1}</td>
                <td>{item.firstname}</td>
                <td>{item.lastname}</td>
                <td>{item.userName}</td>
                <td>{item.rolesList.join(" , ")}</td>
                <td>
                  {item.loginProvider == null ? "Identity" : item.loginProvider}
                </td>
                <td>
                  <Link to={`/Edit/${item.userName}`}>
                    <img className="edit_icon" src={edit} />
                  </Link>
                </td>
                <td>
                  <Link to={""}>
                    <img
                      onClick={() =>
                        handleUserDelete(item.uniqueID, item.userName)
                      }
                      src={delete_icon}
                      className="edit_icon"
                    />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Admin;
