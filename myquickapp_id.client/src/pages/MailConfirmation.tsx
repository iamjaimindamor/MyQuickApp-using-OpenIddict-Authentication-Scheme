import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function MailConfirmation() {
  const navigate = useNavigate();
  useEffect(() => {
    toast.loading("Redirecting To Login Again !", { duration: 2500 });
    setTimeout(() => {
      navigate("/Login");
    }, 2500);
  }, []);

  return (
    <>
      <div className="d-flex justify-content-center logup_success">
        <div>
          <pre>
            <p className="d-flex justify-content-center">
              EMAIL CONFIRMATION SENT!
            </p>
            <h5 className="display-4">
              EMAIL NOT VERIFIED YET.{" "}
              <span className="already">VERIFY YOUR EMAIL</span>
            </h5>
          </pre>
        </div>
      </div>
    </>
  );
}

export default MailConfirmation;
