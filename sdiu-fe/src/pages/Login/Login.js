import "./Login.scss";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../../configs/axiosConfig";
import Logo from "../../assets/logo.png";
import { AiOutlineUser } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { MdAdminPanelSettings } from "react-icons/md";
import { io } from "socket.io-client";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isUser, setIsUser] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [toolTip, showToolTip] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const showUserForm = () => {
    setIsUser(true);
    setIsAdmin(false);
  };
  const showAdminForm = () => {
    setIsUser(false);
    setIsAdmin(true);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (isUser) {
        const { data } = await Axios.post("/auth/login", {
          email,
          password: password,
        });
        localStorage.setItem("authToken", data.access_token);
        navigate("/user");
      }
      if (isAdmin) {
        const { data } = await Axios.post("/authadmin/login", {
          email:adminEmail,
          password: adminPassword,
        });
        localStorage.setItem("authAdminToken", data.access_token);
        navigate("/admin");
      }
    } catch (error) {
      // setError(error.response.data.error);
      toast.error("Wrong password or email", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };
  return (
    <>
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="header">
          <img src={Logo} alt="logo" />
          <h2>Search & Document HCMIU</h2>
        </div>

        <h2 className="text-center text-3xl font-bold my-5">
          {isUser ? "User Login" : "Admin Login"}
        </h2>

        <div className="icon-container">
          <a data-tooltip-id="user" data-tooltip-content="User account">
            <AiOutlineUser
              className="icon"
              onMouseEnter={() => showToolTip(true)}
              onClick={() => showUserForm()}
              onMouseLeave={() => {
                showToolTip(false);
                setTimeout(() => showToolTip(true), 50);
              }}
            />
          </a>
          {toolTip && (
            <ReactTooltip id="user" type="dark" effect="solid">
              <span>User Account</span>
            </ReactTooltip>
          )}
          <a data-tooltip-id="user" data-tooltip-content="User account">
            <MdAdminPanelSettings
              className="icon"
              onMouseEnter={() => showToolTip(true)}
              onClick={() => showAdminForm()}
              onMouseLeave={() => {
                showToolTip(false);
                setTimeout(() => showToolTip(true), 50);
              }}
            />
          </a>
          {toolTip && (
            <ReactTooltip id="admin" type="dark" effect="solid">
              <span>Admin Account</span>
            </ReactTooltip>
          )}
        </div>

        {isUser && (
          <label>
            <span>EMAIL:</span>
            <input
              type="email"
              id="username"
              value={email}
              required
              placeholder="Enter student email"
              onChange={(e) => setEmail(e.target.value)}></input>
          </label>
        )}
        {isAdmin && (
          <label>
            <span>EMAIL:</span>
            <input
              type="email"
              id="username"
              value={adminEmail}
              required
              placeholder="Enter admin email"
              onChange={(e) => setAdminEmail(e.target.value)}></input>
          </label>
        )}
        {isUser && (
          <label>
            <span>PASSWORD:</span>
            <input
              type="password"
              name="psw"
              id="password"
              placeholder="Enter your password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}></input>
          </label>
        )}
        {isAdmin && (
          <label>
            <span>PASSWORD:</span>
            <input
              type="password"
              name="psw"
              id="password"
              placeholder="Enter your password"
              value={adminPassword}
              required
              onChange={(e) => setAdminPassword(e.target.value)}></input>
          </label>
        )}
        <button type="submit" className="btn">
          Login
        </button>
        {isUser && (
          <>
            <p className="noUnderline">
              Don't have account? <Link to="/register">Create new account</Link>
            </p>
            <p className="noUnderline">
              Forgot password? <Link to="/forgotpassword">Fill the form</Link>
            </p>
          </>
        )}
      </form>
      <ToastContainer />
    </>
  );
}
export default Login;
