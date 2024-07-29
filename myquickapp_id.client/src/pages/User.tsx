import SideBar from "../components/dashboard/SideBar";
import { useAppSelector } from "../hooks/hook";
import { RootState } from "../store";
import Typewriter from "typewriter-effect";

const User = () => {
  const Name = useAppSelector((state: RootState) => state.auth.firstname);
  var roles = useAppSelector((state: RootState) => state.auth.rolesList);
  return (
    <>
      <SideBar />
      <div className="col-md-11 welcome_div_mobile">
        <div className="container_welcome">
          <pre>
            <h2 className="text_welcome typewriter display-2">Hey, {Name}</h2>
          </pre>
        </div>
        <br />
        <pre className="display-3 ">
          <Typewriter
            onInit={(typewriter) => {
              typewriter
                .pauseFor(2517)
                .typeString(
                  `Welcome to MyQuick<span style="color:#0d6efd">App</span>...>_`
                )
                .pauseFor(3500)
                .deleteAll(3.2)
                .typeString(
                  `You have Access for<span style="color:#0d6efd"> ${roles.join(
                    ", "
                  )}</span> Roles`
                )
                .start();
            }}
          />
        </pre>
      </div>
    </>
  );
};

export default User;
