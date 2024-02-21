import {
  Box,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Tooltip,
  IconButton,
  Snackbar,
  MuiAlert,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDispatch } from "react-redux";
import { addNews } from "../../redux/features/news/newsSlice";
import { ToastContainer,toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

function AddNews() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [pictures, setPictures] = useState(null);
  const [link, setLink] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!title || !description || !link || !dueDate || !pictures) {
      toast.error("Missing values", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    const formData = new FormData();
    formData.append("image", pictures);
    try{
      const response = await axios.post(
        "http://localhost:8080/uploadcloudinary/upload",
        formData
      );
      const cloudinaryUrl = response.data.cloudinary_url;
      const data = { title, description, link, dueDate, pictures: cloudinaryUrl };
      data.dueDate = `${dueDate.$D}/${dueDate.$M}/${dueDate.$y}`;
      console.log(data);
      dispatch(addNews(data));
      setTitle("")
      setDueDate(null)
      setPictures(null)
      setDescription("")
      setLink("")
      setImagePreview(null)
      toast.success("Post successful", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }catch(e){
      console.error(e.message);
    }
  };

  const handleDateChange = (date) => {
    setDueDate(date);
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

  return (
    <Box bgcolor="white" flex={5} p={3}>
      <Typography variant="h4" gutterBottom>
        Create news
      </Typography>
      <Box sx={{ paddingBottom: "20px", marginRight: "10px" }}>
        <TextField
          required
          fullWidth
          id="outlined-required"
          label="Title"
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
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          defaultValue=""
          multiline
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

      <Box sx={{ paddingBottom: "20px", marginRight: "10px" }}>
        <TextField
          required
          fullWidth
          id="standard-multiline-flexible"
          label="Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          defaultValue=""
          multiline
          sx={{ backgroundColor: "white" }}
        />
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
          <div>{imagePreview && <img src={imagePreview} style={{ maxWidth: "100%", maxHeight: "200px" }}  alt="Preview" />}</div>
        </div>
      </Box>
      <Box sx={{ paddingBottom: "20px", marginRight: "10px" }}>
        <Button variant="outlined" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
      <ToastContainer/>
    </Box>
  );
}

export default AddNews;
