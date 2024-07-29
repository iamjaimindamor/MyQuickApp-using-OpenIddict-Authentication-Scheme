import logo from "../../assets/Home.png";
import "../../App.css";

function Header() {
    return (
        <>
            <img src={logo} width={74} height={74} className="bird_logo" />
            <pre className="HomeLogoName">
                <span className="quickHome">
                    <b>
                        MyQuick<span className="quickHomeApp">App</span>
                    </b>
                </span>
                <span className="HomeLogo">
                    <i> by Jaimin</i>
                </span>
            </pre>
            <hr />
        </>
    );
}

export default Header;