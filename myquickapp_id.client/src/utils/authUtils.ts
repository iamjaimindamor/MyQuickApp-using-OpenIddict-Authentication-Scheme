import { useSelector } from "react-redux";
import { RootState } from "../store";

export const CheckAdminAccess = () => {
    let isAdmin = false;
    isAdmin = useSelector((state: RootState) =>
        state.auth.rolesList.includes("ADMIN")
    );
    return isAdmin;
};