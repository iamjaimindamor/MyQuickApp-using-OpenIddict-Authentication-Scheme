import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import Header from "../components/common/Header";

function Home() {
  return (
    <>
      <Header />
      <div className="container home">
        <h2 className="home d-flex justify-content-center display-2">
          <pre className="brand">
            {" "}
            Welcome To MyQuick<span className="home heading">App</span>
          </pre>{" "}
        </h2>
        <div className="row home_row">
          <div className="col d-flex justify-content-center">
            <span className="homebutton">
              <Link to="/Register">
                <Button variant="contained">Join Us</Button>
              </Link>
            </span>
            <span className="homebutton">
              <Link to="/Login">
                <Button variant="outlined">Login</Button>
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
