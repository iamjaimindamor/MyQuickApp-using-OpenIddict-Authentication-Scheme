import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ExternalSignUp() {
    const navigate = useNavigate();

    toast.loading("Redirecting To Login....", { duration: 1950 });

    setTimeout(() => {
        navigate("/Login");
    }, 1950);

    return (
        <>
            <div className="d-flex justify-content-center logup_success">
                <div>
                    <pre>
                        <h3 className="display-2">Google Sign Up Success &#x2705;</h3>
                    </pre>
                </div>
            </div>
        </>
    );
}

export default ExternalSignUp;