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
            <p className="d-flex justify-content-center">Email Confirmed!</p>
            <h4 className="display-2">
              EMAIL <span className="already">VERIFIED SUCCESS &#x2705;</span>
            </h4>
          </pre>
        </div>
      </div>
    </>
  );
}

export default MailConfirmation;
