import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ExistingUser() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.loading("Redirecting To Login", { duration: 1950 });
    setTimeout(() => {
      navigate("/Login");
    }, 1950);
  }, []);

  return (
    <>
      <div className="d-flex justify-content-center logup_success">
        <div>
          <pre>
            <h3 className="display-2">
              Already A User With MyQuick<span className="already">App</span>
            </h3>
          </pre>
        </div>
      </div>
    </>
  );
}

export default ExistingUser;
