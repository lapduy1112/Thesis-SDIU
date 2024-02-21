import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  CardMedia,
  InputBase,
  SpeedDial,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/system/Unstable_Grid/Grid";
import { useNavigate, Link } from "react-router-dom";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import Axios from "../../../src/configs/axiosConfig";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import ReportIcon from '@mui/icons-material/Report';
function Feed() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate("/user/addpost");
  };
  const handleOpenReport = () => {
    navigate("/user/addreport");
  };
  const accessToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("/posts", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const sortedPosts = response.data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [accessToken]);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <Box bgcolor="white" flex={5} p={3}>
      <Box sx={{ paddingBottom: "10px" }}>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      <Grid container spacing={4}>
        {filteredPosts.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Link
              to={`/user/post/${item._id}`}
              style={{ textDecoration: "none", color: "inherit" }}>
              <Card
                sx={{
                  maxWidth: 345,
                  backgroundColor: "white",
                  boxShadow: 2,
                  border: 1,
                  borderColor: "rgba(0, 0, 0, 0.1)",
                }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {item.owner.name}-{item.owner.studentId}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {item.title}
                  </Typography>
                  <Typography variant="body2">{item.category} ITEM</Typography>
                </CardContent>
                <CardMedia
                  component="img"
                  height="194"
                  image={item.pictures}
                  alt="Paella dish"
                />
                <CardActions>
                  <Button size="small">Show More</Button>
                </CardActions>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          height: 320,
          transform: "translateZ(0px)",
          flexGrow: 1,
          position: "fixed", // Fixed position to stick to the screen
          bottom: 16,
          right: 16,
          zIndex: 1000, // Set a high zIndex to ensure it appears above other elements
        }}>
        <SpeedDial
          ariaLabel="SpeedDial openIcon example"
          sx={{ position: "absolute", bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          >
          {/* Thêm SpeedDialAction cho Add Post */}
          <SpeedDialAction
            key="AddPost"
            icon={<AddIcon />}
            tooltipTitle="Add Post"
            onClick={handleOpen}
          />
          {/* Thêm SpeedDialAction cho Add Report */}
          <SpeedDialAction
            key="AddReport"
            icon={<ReportIcon />}
            tooltipTitle="Add Report"
            onClick={handleOpenReport}
          />
        </SpeedDial>
      </Box>
    </Box>
  );
}

export default Feed;
