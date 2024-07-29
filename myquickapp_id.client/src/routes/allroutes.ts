export const PUBLIC_ACCESS_PATH = {
  VITE_USERNAME_URL: "/User/isUserByName?username= ",
  VITE_EMAIL_URL: "/User/isUserByEmail?email=",
  VITE_CREATE_USER_URL: "/User/Create",
  CURRRENT_USER: "/User/Current",
  LOGIN_USER: "/Auth/LogIn",
  NEW_USER_PASSWORD: "/Auth/NewUserPassword",
  RESET_REQUEST: "/User/FetchReset?userID=",
};

export const GET_USER_ACCESS_PATH = {
  USERID_INFO_URL: "/User/ReadByID?id=",
  USER_UPDATE_URL: "/User/Update?UserID=",
};

export const USER_AUTH_PATH = {
  CURRENT_USER_AUTH: "/User/Current",
  UPDATE_USER: "/User/Update?UserID=",
  LOGOUT_CURRENT_USER: "/Auth/Sign-Out",
  DELETE_CURRENT_USER: "/User/ID?user_id=",
};

export const ADMIN_PATH = {
  ALL_USR_LIST: "/User/All",
  ALL_ORGANIZATION_ROLES: "/Auth/Roles",
  GET_USER_DATA: "/User/ReadByName?username=",
  DELETE_USER_ROLE: "/Auth/RemoveAccess?",
  ASSIGN_ROLES: "/Auth/AssignRole",
  DELETE_USER: "/User/ID?user_id=",
  BLOCK_USER: "/Auth/Block-User",
};
