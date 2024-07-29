import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ExistingUser() {
  const navigate = useNavigate();
  useEffect(() => {
    toast.loading("Redirecting To Register Page", { duration: 2500 });
    setTimeout(() => {
      navigate("/Login");
    }, 2500);
  }, []);

  return (
    <>
      <div className="d-flex justify-content-center logup_success">
        <div>
          <pre>
            <h3 className="display-2">
              Not A User with MyQuick<span className="already">App</span>
            </h3>
          </pre>
        </div>
      </div>
    </>
  );
}

export default ExistingUser;
