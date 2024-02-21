import { Mail, Notifications, Pets } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  styled,
  Toolbar,
  Typography,
  IconButton,
  Popover,
  Tooltip,
  Paper,
} from "@mui/material";
import { useState, useEffect } from "react";
import Person4Icon from "@mui/icons-material/Person4";
import logo from "../../assets/logo.png";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import HomeIcon from "@mui/icons-material/Home";
import { Link, useParams } from "react-router-dom";
import Axios from "../../../src/configs/axiosConfig";
import NotificationList from "./NotificationList ";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Icons = styled(Box)(({ theme }) => ({
  display: "none",
  alignItems: "center",
  gap: "20px",
  [theme.breakpoints.up("sm")]: {
    display: "flex",
  },
}));

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openAva, setOpenAva] = useState(false);
  const [anchorAvaE1, setAnchorAvaE1] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const accessToken = localStorage.getItem("authToken");
  const decoded = jwtDecode(accessToken);
  const userId = decoded.payload.user._id;
  const navigate = useNavigate();
  const handleAvaClick = (event) => {
    setAnchorAvaE1(event.currentTarget);
    setOpenAva(true);
  };
  const handleMessengerClick = (event) => {
    event.preventDefault();
    window.location.href = "/user/messenger";
  };
  const fetchNotifications = async () => {
    try {
      const response = await Axios.get(`/notify/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const sortedNotifications = response.data.sort(
        (a, b) =>
          parseInt(b._id.toString().substring(0, 8), 16) -
          parseInt(a._id.toString().substring(0, 8), 16)
      );
      setNotifications([...notifications,...sortedNotifications]);
    } catch (error) {
      console.log("Error fetching notifications: ", error);
    }
  };

  const handleNotiClose = async () => {
    try {
      await Axios.put("/notify/all/read", {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

    } catch (error) {
      console.error("Error updating all notification statuses: ", error);
    }
    setAnchorAvaE1(null);
    setOpenAva(false);
  };

  const handleNotificationsClick = (event) => {
    fetchNotifications();
    handleNotiClose();
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleNotificationsClose = () => {
    setAnchorEl(null);
    setOpen(false);
    resetNewNotificationCount();
  };

  const resetNewNotificationCount = () => {
    setNewNotificationCount(0);
  };

  // useEffect(() => {
  //   fetchNotifications();

  //   const intervalId = setInterval(() => {
  //     fetchNotifications();
  //   }, 5000);

  //   return () => clearInterval(intervalId);
  // }, [userId, accessToken]);

  useEffect(() => {
    let invalid = true;
    const fetchNewNotificationCount = async () => {
      if (!invalid) return;
      try {
        const response = await Axios.get("/notify/unread", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const newNotificationCount = response.data.unreadCount;
        setNewNotificationCount(newNotificationCount);
      } catch (error) {
        console.error("Error fetching new notification count: ", error);
      }
    };
    const intervalCall = setInterval(fetchNewNotificationCount, 2000);
    return () => {
      invalid = false;
      if (intervalCall) {
        clearInterval(intervalCall);
      }
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    localStorage.removeItem("authToken");
    localStorage.removeItem("authAdminToken");
    window.location.href = "/login";
  };
  return (
    <AppBar position="sticky" sx={{ backgroundColor: "rgb(240, 240, 240)" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <IconButton>
          <Avatar sx={{ width: 40, height: 40 }} src={logo} />
          <Typography
            variant="h6"
            sx={{ display: { xs: "none", sm: "block" } }}>
            SDIU
          </Typography>
        </IconButton>
        <Pets sx={{ display: { xs: "block", sm: "none" } }} />
        <Icons>
          <Tooltip title="Feed">
            <IconButton component={Link} to="/user">
              <HomeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="News">
            <IconButton component={Link} to="/user/news">
              <NewspaperIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Message">
            <IconButton onClick={handleMessengerClick}>
              <Mail />
            </IconButton>
          </Tooltip>
          <Tooltip title="Profile">
            <IconButton component={Link} to="/user/profile">
              <Person4Icon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notification">
            <IconButton onClick={handleNotificationsClick}>
              <Badge badgeContent={newNotificationCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
          <Avatar
            sx={{ bgcolor: "gray", width: 30, height: 30, cursor: "hover" }}
            aria-label="recipe"
            onClick={handleAvaClick}
          />
        </Icons>
        <Menu
          id="basic-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorAvaE1}
          open={openAva}
          onClose={handleNotiClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}>
          <MenuItem component={Link} to="/user/mypost">
            My Post
          </MenuItem>
          <MenuItem component={Link} to="/user/foundpost">
            Found Post
          </MenuItem>
          <MenuItem component={Link} to="/user/lostpost">
            Lost Post
          </MenuItem>
          <MenuItem component={Link} to="/user/availablepost">
            Available Post
          </MenuItem>
          <MenuItem component={Link} to="/user/completepost">
            Completed Post
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleNotificationsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          width: "400px",
        }}>
        <Paper style={{ padding: "10px", width: "400px", maxHeight: "400px" }}>
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
          <List>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <ListItem
                  key={notification._id}
                  component={Link}
                  to={notification.url}>
                  <ListItemText primary={notification.text} />
                  <Divider variant="inset" component="li" />
                </ListItem>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary">
                No notifications yet
              </Typography>
            )}
          </List>
        </Paper>
      </Popover>
    </AppBar>
  );
};

export default Navigation;
