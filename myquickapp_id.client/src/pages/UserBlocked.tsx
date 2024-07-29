import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function UserBlocked() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.loading("Redirecting To Login", { duration: 1950 });
    setTimeout(() => {
      navigate("/Login");
    }, 1950);
  }, []);

  return (
    <>
      <pre>
        <h6 className="login_error">USER BLOCKED</h6>
      </pre>
    </>
  );
}

export default UserBlocked;
