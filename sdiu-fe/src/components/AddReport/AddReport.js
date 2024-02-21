import {
    Box,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
  } from "@mui/material";
  import { useState } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import { useDispatch, useSelector } from "react-redux";
  import { addReport } from "../../redux/features/report/reportSlice";
  import axios from "axios";
  import { jwtDecode } from "jwt-decode";
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  
  function AddReport() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const accessToken = localStorage.getItem("authToken");
    const decoded = jwtDecode(accessToken);
    const report = useSelector((state) => state.report);
    const handleSubmit = async (e) => {
      e.preventDefault();
      if ( !content ) {
        toast.error("Missing values", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return; 
      }
      try {
        const data = {
          content,
          owner: decoded.payload.user._id,
        };
        dispatch(addReport(data));
        console.log(data);
        setContent("");
        toast.success("Report successful", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (e) {
        console.error(e.message);
        toast.error("Report failed", {
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
      <Box bgcolor="white" flex={5} p={3}>
        <Typography variant="h4" gutterBottom>
          Report Page
        </Typography>
        <Box sx={{ paddingBottom: "20px", marginRight: "10px" }}>
          <TextField
            required
            fullWidth
            id="standard-multiline-flexible"
            label="Report Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            defaultValue=""
            multiline
            rows={6}
            sx={{ backgroundColor: "white" }}
          />
        </Box>
        <Box sx={{ paddingBottom: "20px", marginRight: "10px" }}>
          <Button variant="outlined" onClick={handleSubmit}>
            {report.isLoading === true ? ("Loading..."):("Submit")
            }
          </Button>
        </Box>
        <ToastContainer />
      </Box>
    );
  }
  
  export default AddReport;
  