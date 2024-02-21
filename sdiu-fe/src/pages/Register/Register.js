import "./Register.scss";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../../configs/axiosConfig";
import Logo from "../../assets/logo.png";
import { ToastContainer } from "react-toastify";
import { register, clearError } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [studentId, setStudentId] = useState("");
  const [phone, setPhone] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAdmin = false;

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !email ||
      !password ||
      !confirm_password ||
      !phone ||
      !studentId ||
      password !== confirm_password ||
      isAdmin
    ) {
      return toast.error("Invalid or missing values");
    }

    const data = { name, studentId, email, password,phone };
    console.log(data);
    try {
      await dispatch(register(data)).unwrap();
      toast.success("Register successful, Please Verify email", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setName("");
      setEmail("");
      setPassword("");
      setStudentId("");
      setPhone("");
      setConfirmPassword("");
      dispatch(clearError());
      // navigate("/");
    } catch (error) {
      console.error("Error from Sign up page ", error);
      toast.error("Register Failed", {
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
      <form className="auth-form" onSubmit={handleRegister}>
        <div className="header">
          <img src={Logo} alt="logo" />
          <h2>Search & Document HCMIU</h2>
        </div>

        <h2>Sign up for User</h2>
        <label>
          <span>User Name:</span>
          <input
            type="text"
            id="name"
            value={name}
            required
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}></input>
        </label>
        <label>
          <span>Student ID:</span>
          <input
            type="text"
            id="username"
            value={studentId}
            required
            placeholder="Enter your email"
            onChange={(e) => setStudentId(e.target.value)}></input>
        </label>
        <label>
          <span>Phone:</span>
          <input
            type="text"
            id="phone"
            value={phone}
            required
            placeholder="Enter your phone number"
            onChange={(e) => setPhone(e.target.value)}></input>
        </label>
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
        <label>
          <span>Password:</span>
          <input
            type="password"
            name="psw"
            id="password"
            placeholder="Enter your password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}></input>
        </label>
        <label>
          <span>Confirm Password:</span>
          <input
            type="password"
            name="psw"
            id="password"
            placeholder="Confirm password"
            value={confirm_password}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}></input>
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
export default Register;
