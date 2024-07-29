export default interface IAuthenticationDetails {
  uniqueID: string;
  userName: string;
  firstname: string;
  lastname: string | null;
  email: string;
  phoneNumber: string | null;
  rolesList: [string];
  loginProvider: string | null;
  createdAt: string | null;
  modifiedAt: string | null;
  isBlocked: boolean;
}

export enum initialRoles {
  USER = "USER",
  ADMIN = "ADMIN",
  OWNER = "OWNER",
}

export interface IAuthenticationState {
  isAuthenticated: boolean;
}

export interface ISessionState {
  isSessionExpired: boolean;
}

export interface ILogin {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface Roles {
  id: string;
  name: string;
  normalizedName: string;
  concurrencyStamp: string;
}

export interface IBlockUser {
  username: string;
  value: boolean;
}

export interface AssignRole {
  username: string;
  rolename: string;
}

export interface IUpdateData {
  firstname: string;
  lastname: string | null;
  userName: string;
  email: string;
  phoneNumber: string | null;
  currentPassword: string;
  newPassword: string;
  Confirm_Password: string;
}

export interface INewPasswordRequest {
  email: string;
  newPass: string;
  token: string;
}

export interface IUsername {
  username: string;
}

export interface Props {
  children: React.ReactNode;
}

export interface IError {
  statuscode: string;
  error: string;
}

export interface IUpdateTheGlobalState {
  forceUpdate: boolean;
}

export interface IUser {
  uniqueID: string;
  Username: string;
  Roles: string[];
  Email: string;
}
