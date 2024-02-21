import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import UserLayout from "./routes/UserLayout";
import AdminLayout from "./routes/AdminLayout";
// import { io } from "socket.io-client";

function App() {
  // const socket = io("http://localhost:8080");
  // socket.on('connect',socket=>{
  //   console.log(`hello ${socket.id}`)
  // })

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/user/*" element={<UserLayout />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
