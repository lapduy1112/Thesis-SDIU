import "./ForgotPassword.scss";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../../configs/axiosConfig";
import Logo from "../../assets/logo.png";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Invalid or missing Email", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    try {
      const { data } = await Axios.post("/auth/request-passwordreset", {
        email,
      });
      toast.success("Reset Password Link has been sent to your account.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // navigate("/login");
    } catch (error) {
      console.error("Error from Sign up page ", error);
      toast.error("Wrong Email", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <>
      <form className="auth-form" onSubmit={handleReset}>
        <div className="header">
          <img src={Logo} alt="logo" />
          <h2>Search & Document HCMIU</h2>
        </div>

        <h2>Reset Password</h2>
        <label>
          <span>Email:</span>
          <input
            type="email"
            id="email"
            value={email}
            required
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}></input>
        </label>
        <button type="submit" className="btn">
          Create
        </button>
        <p>
          Already have account?
          <Link to="/login">Sign in</Link>
        </p>
      </form>
      <ToastContainer />
    </>
  );
}
export default ForgotPassword;
