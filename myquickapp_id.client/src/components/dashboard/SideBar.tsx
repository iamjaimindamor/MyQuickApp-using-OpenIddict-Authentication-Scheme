import logo from "../../assets/Home.png";
import profile from "../../assets/user.png";
import Selectedprofile from "../../assets/user (1).png";
import Selectedadmin from "../../assets/management (1).png";
import admin from "../../assets/management.png";
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";
import SignedIn from "../../assets/shutdown (1).png";
import LoggingOut from "../../assets/shutdown.png";
import { useAppSelector } from "../../hooks/hook";
import { RootState } from "../../store";

const SideBar = () => {
    const isAdmin = useAppSelector((state: RootState) => state.auth.rolesList);
    const username = useAppSelector((state: RootState) => state.auth.userName);

    return (
        <div className="sidebar">
            <Link to={`/${username}`}>
                <Tooltip title="Welcome" placement="right" arrow>
                    <img src={logo} className="sidebar_logo" />
                </Tooltip>
            </Link>
            <br />
            <br />
            <ul className="list">
                <li>
                    <Link to={`/Profile/${username}`} className="sidebar_link">
                        <Tooltip title="User Profile" placement="right" arrow>
                            <img
                                className="profile"
                                alt="profile"
                                src={
                                    window.location.pathname === `/Profile/${username}`
                                        ? `${Selectedprofile}`
                                        : `${profile}`
                                }
                            />
                        </Tooltip>
                    </Link>
                </li>
                <br />
                <br />
                {isAdmin.includes("ADMIN") ? (
                    <>
                        <li>
                            <Link to="/Admin" className="sidebar_link">
                                <Tooltip title="Admin Panel" placement="right" arrow>
                                    <img
                                        className="profile"
                                        alt="profile"
                                        src={
                                            window.location.pathname === "/Admin"
                                                ? `${Selectedadmin}`
                                                : `${admin}`
                                        }
                                    />
                                </Tooltip>
                            </Link>
                        </li>
                        <br />
                        <br />
                    </>
                ) : (
                    ""
                )}

                <li>
                    <Link to="/User/LogOut" className="sidebar_link">
                        <Tooltip title="Log Out" placement="right" arrow>
                            <img
                                className="profile"
                                alt="profile"
                                src={
                                    window.location.pathname === "/User/LogOut"
                                        ? `${LoggingOut}`
                                        : `${SignedIn}`
                                }
                            />
                        </Tooltip>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default SideBar;