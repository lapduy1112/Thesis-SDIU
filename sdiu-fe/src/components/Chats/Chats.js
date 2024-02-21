import {
  Box,
  Typography,
  Grid,
  InputBase,
  Stack,
  Button,
  Divider,
  Avatar,
  Badge,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ChatElement from "./ChatElement";
import Axios from "../../../src/configs/axiosConfig";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 20,
  backgroundColor: alpha(theme.palette.background.paper, 1),
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
}));
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: "100%",
  },
}));

const truncateText = (string, n) => {
  return string?.length > n ? `${string?.slice(0, n)}...` : string;
};

function Chats() {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const accessToken = localStorage.getItem("authToken");
  const decoded = jwtDecode(accessToken);
  const userId = decoded.payload.user._id;
  useEffect(() => {
    const getChats = async () => {
      try {
        const response = await Axios.get(`/conversations/${userId}`);
        setChats(response.data);
        console.log(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    getChats();
  }, [userId]);
  return (
    <Box
      sx={{
        position: "relative",
        height: "540px",
        width: "100%",
        backgroundColor: "#F8FAFF",
        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      }}>
      <Stack p={3} spacing={2} sx={{ height: "100vh" }}>
        <Stack sx={{ width: "100%" }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Stack>
        <Stack spacing={1}>
          <Stack direction={"row"} alignItems="center" sx={{ paddingLeft: 5 }}>
            <Button variant="text">Add New Conversation</Button>
          </Stack>
          <Divider />
        </Stack>
        <Stack
          spacing={1}
          sx={{ flexGrow: 1, overflow: "scroll", height: "100%" }}>
          {chats.map((chat) => {
            return (
              <div onClick={() => setCurrentChat(chat)}>
                <ChatElement data={chat} currentUser={userId} />
              </div>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}

export default Chats;
