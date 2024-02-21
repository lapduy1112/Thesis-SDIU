import {
    Box,
    Card,
    CardActions,
    CardContent,
    Button,
    Typography,
    CardHeader,
    Stack,
    CardMedia,
    Avatar,
    IconButton,
    Tabs,
    Tab,
    styled,
    InputBase,
    SearchIcon,
    SpeedDial,
  } from "@mui/material";
  import { useState, useEffect } from "react";
  import { red } from "@mui/material/colors";
  import MoreVertIcon from "@mui/icons-material/MoreVert";
  import Grid from "@mui/system/Unstable_Grid/Grid";
  import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
  import { useNavigate, Link } from "react-router-dom";
  import SpeedDialIcon from "@mui/material/SpeedDialIcon";
  import Axios from "../../../src/configs/axiosConfig";
  
  function LostList() {
    const [value, setValue] = useState(0);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    const handleOpen = () => {
      navigate("/user/addpost");
    };
    const handleClick = (event) => {
      event.preventDefault();
      navigate("/user/");
    };
    const breadcrumbs = [
      <Link
        underline="hover"
        key="1"
        color="inherit"
        style={{ cursor: "pointer",fontSize:"1.5rem",textDecoration:"none" }}
        onClick={handleClick}
        variant="h5">
        Feed
      </Link>,
      <Typography key="3" variant="h5" color="text.primary">
        Lost Posts List
      </Typography>,
    ];
    const accessToken = localStorage.getItem("authToken");
    useEffect(() => {
      const func = async () => {
        const response = await Axios.get("/posts/lostposts", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const sortedPosts = response.data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setPosts(sortedPosts);
      };
      func();
      return;
    }, []);
  
    return (
      <Box bgcolor="white" flex={5} p={3}>
     <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        gutterBottom>
        {breadcrumbs}
      </Breadcrumbs>
        <Grid container spacing={4}>
          {posts &&
            posts.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3}>
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
                      <Typography variant="body2">
                        {item.category} ITEM
                      </Typography>
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
            onClick={handleOpen}
          />
        </Box>
      </Box>
    );
  }
  export default LostList;
  