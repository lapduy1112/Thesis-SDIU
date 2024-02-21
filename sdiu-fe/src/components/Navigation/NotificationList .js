import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import Axios from "../../../src/configs/axiosConfig";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const accessToken = localStorage.getItem("authToken");
  const decoded = jwtDecode(accessToken);
  const userId = decoded.payload.user._id;

  useEffect(() => {
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
        setNotifications(sortedNotifications);
        console.log(sortedNotifications.length);
      } catch (error) {
        console.log("Error fetching notifications: ", error);
      }
    };

    fetchNotifications();

    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [userId, accessToken]);

  return (
    <Paper style={{ padding: "10px", width: "400px" }}>
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
          <Typography variant="body2" color="text.secondary">
            No notifications
          </Typography>
        )}
      </List>
    </Paper>
  );
};

export default NotificationList;
