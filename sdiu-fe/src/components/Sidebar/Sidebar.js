import React from "react";
import "./Sidebar.scss";
import { Link } from "react-router-dom";
import {
  RssFeed,
  Chat,
  PlayCircleFilledOutlined,
  Group,
  Bookmark,
  HelpOutline,
  WorkOutline,
  Event,
  School,
  Home as HomeIcon,
  PostAdd as PostAddIcon,
  BrandingWatermark as BrandingWatermarkIcon,
  Message as MessageIcon,
  Newspaper as NewspaperIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import DnsIcon from '@mui/icons-material/Dns';
import AssessmentIcon from '@mui/icons-material/Assessment';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";
import { jwtDecode } from "jwt-decode";

export default function Sidebar() {
  const handleLogout = () => {
    localStorage.clear();
    localStorage.removeItem("authAdminToken");
    window.location.href = "/login";
  };
  const accessAdminToken = localStorage.getItem("authAdminToken");
  const decoded = jwtDecode(accessAdminToken);
  const email=decoded.payload.admin.email
  const menuItems = [
    { icon: <AssessmentIcon />, text: "Dashboard", link: "/admin" },
    { icon: <Group />, text: "Student List", link: "/admin/studentmanage" },
    { icon: <NewspaperIcon />, text: "News List", link: "/admin/newsmanage" },
    {
      icon: <PlayCircleFilledOutlined />,
      text: "Post List",
      link: "/admin/postmanage",
    },
    { icon: <DnsIcon />, text: "Report List", link: "/admin/reportmanage" },
    { icon: <PostAddIcon />, text: "Create News", link: "/admin/addnews" },
    { icon: <LogoutIcon />, text: "Logout", onClick: handleLogout },
  ];

  return (
    <Box flex={1} p={1} sx={{ display: { xs: "none", sm: "block" } }}>
      <Box mb={2} p={2} sx={{ backgroundColor: "#f8f8f8", borderRadius: 8 }}>
        <Typography variant="h5">{email}</Typography>
      </Box>
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              component={Link}
              to={item.link}
              onClick={item.onClick}
              sx={{ "&.Mui-selected": { backgroundColor: "#f5f5f5" } }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
