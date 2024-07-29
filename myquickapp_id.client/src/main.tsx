import ReactDOM from "react-dom/client";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./components/auth/Login.tsx";
import Register from "./components/auth/Register.tsx";
import Home from "./pages/Home.tsx";
import User from "./pages/User.tsx";
import Profile from "./pages/Profile.tsx";
import Admin from "./pages/Admin.tsx";
import { Provider } from "react-redux";
import { store } from "./store.tsx";
import ProtectedRoute from "./routes/ProtectedRoute.tsx";
import App from "./App.tsx";
import LogOut from "./components/auth/LogOut.tsx";
import ExternalSignUp from "./components/auth/ExternalSignUp.tsx";
import ExistingUser from "./pages/ExistingUser.tsx";
import NonUser from "./pages/NonUser.tsx";
import MailConfirmation from "./pages/MailConfirmation.tsx";
import MailVerified from "./pages/MailVerified.tsx";
import MailConfirmFailed from "./pages/MailConfirmFailed.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import ResetRequest from "./pages/ResetRequest.tsx";
import Edit from "./pages/Edit.tsx";
import UserBlocked from "./pages/UserBlocked.tsx";
import AuthErrorHandler from "./pages/AuthErrorHandler.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/Register",
    element: <Register />,
  },
  {
    path: "/Google/Sign-Up",
    element: <ExternalSignUp />,
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/:username",
    element: (
      <ProtectedRoute>
        <User />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Profile/:username",
    element: (
      <>
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </>
    ),
  },
  {
    path: "/Admin",
    element: (
      <>
        <ProtectedRoute>
          <Admin />
        </ProtectedRoute>
      </>
    ),
  },
  {
    path: "/Edit/:username",
    element: (
      <ProtectedRoute>
        <Edit />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Google/Already_SignedUp",
    element: <ExistingUser />,
  },
  {
    path: "/Google/NotAUser",
    element: <NonUser />,
  },
  {
    path: "/Email-Confirmation",
    element: <MailConfirmation />,
  },
  {
    path: "/Mail-Verified",
    element: <MailVerified />,
  },
  {
    path: "/Mail-Verification-Failed",
    element: <MailConfirmFailed />,
  },
  {
    path: "/Reset-Password",
    element: <ResetPassword />,
  },
  {
    path: "/Reset-Request",
    element: <ResetRequest />,
  },
  {
    path: "/User/Forbidden",
    element: <AuthErrorHandler />,
  },
  {
    path: "/AccessRevoked",
    element: <UserBlocked />,
  },
  {
    path: "/User/LogOut",
    element: <LogOut />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <App />
  </Provider>
);

// <React.StrictMode>
{
  /* </React.StrictMode> */
}
