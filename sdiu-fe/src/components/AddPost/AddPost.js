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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../../redux/features/post/postSlice";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddPost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [pictures, setPictures] = useState(null);
  const [category, setCategory] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const accessToken = localStorage.getItem("authToken");
  const decoded = jwtDecode(accessToken);
  const post = useSelector((state) => state.post);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !dueDate || !category || !pictures) {
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
    const formData = new FormData();
    formData.append("image", pictures);
    try {
      const response = await axios.post(
        "http://localhost:8080/uploadcloudinary/upload",
        formData
      );
      const cloudinaryUrl = response.data.cloudinary_url;
      const data = {
        title,
        description,
        category,
        dueDate,
        status: "AVAILABLE",
        pictures: cloudinaryUrl,
        owner: decoded.payload.user._id,
      };
      data.dueDate = `${dueDate.$D}/${dueDate.$M}/${dueDate.$y}`;
      dispatch(addPost(data));
      console.log(data);
      setTitle("");
      setDueDate(null);
      setPictures(null);
      setDescription("");
      setCategory("");
      setImagePreview(null);
      toast.success("Post successful", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (e) {
      console.error(e.message);
      toast.error("Post failed", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // Lưu trữ file đã chọn trong state
    setPictures(file);

    // Tạo URL dựa trên file để xem trước hình ảnh (nếu là ảnh)
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCategory = (event) => {
    setCategory(event.target.value);
  };
  const handleDateChange = (date) => {
    setDueDate(date);
  };
  return (
    <Box bgcolor="white" flex={5} p={3}>
      <Typography variant="h4" gutterBottom>
        Create new post
      </Typography>
      <Box sx={{ paddingBottom: "20px", marginRight: "10px" }}>
        <TextField
          required
          fullWidth
          id="outlined-required"
          label="Post title"
          value={title}
          defaultValue=""
          sx={{ backgroundColor: "white" }}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Box>
      <Box sx={{ paddingBottom: "20px", marginRight: "10px" }}>
        <TextField
          required
          fullWidth
          id="standard-multiline-flexible"
          label="Post Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          defaultValue=""
          multiline
          maxRows={4}
          rows={4}
          sx={{ backgroundColor: "white" }}
        />
      </Box>
      <Box sx={{ paddingBottom: "20px", marginRight: "10px" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Basic date picker"
            value={dueDate}
            onChange={handleDateChange}
          />
        </LocalizationProvider>
      </Box>
      <Box sx={{ minWidth: 120, paddingBottom: "20px", marginRight: "10px" }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Post Category </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={category}
            label="Post category"
            onChange={handleCategory}>
            <MenuItem value={"FOUND"}>Found</MenuItem>
            <MenuItem value={"LOST"}>Lost</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ paddingBottom: "20px", marginRight: "10px" }}>
        <div>
          <input
            accept="image/*"
            name="image"
            style={{ display: "none" }}
            id="contained-button-file"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="contained-button-file">
            <Button variant="contained" component="span">
              Upload Image
            </Button>
          </label>
          <div>
            {imagePreview && (
              <img
                src={imagePreview}
                style={{ maxWidth: "100%", maxHeight: "200px" }}
                alt="Preview"
              />
            )}
          </div>
        </div>
      </Box>
      <Box sx={{ paddingBottom: "20px", marginRight: "10px" }}>
        <Button variant="outlined" onClick={handleSubmit}>
          {post.isLoading === true ? ("Loading..."):("Submit")
          }
        </Button>
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default AddPost;
