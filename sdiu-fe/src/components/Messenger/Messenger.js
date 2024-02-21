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
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect, useRef } from "react";
import Axios from "../../../src/configs/axiosConfig";
import Conversation from "../Conversation/Conversation";
import ChatElement from "../Chats/ChatElement";
import { io } from "socket.io-client";

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

function Messenger() {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [studentId, setStudentId] = useState("");
  const accessToken = localStorage.getItem("authToken");
  const decoded = jwtDecode(accessToken);
  const user = decoded.payload.user;
  const userId = decoded.payload.user._id;
  const [open, setOpen] = useState(false);
  const [forceRerender, setForceRerender] = useState(false);
  const [searchId, setSearchId] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSearchId(false)
    setOpen(false);
  };

  useEffect(() => {
    setSocket(io("http://localhost:5000"));
    console.log("ok");
  }, []);

  useEffect(() => {
    socket?.emit("addUser", user?._id);
    socket?.on("getUsers", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  useEffect(() => {
    if (sendMessage !== null) {
      socket?.emit("sendMessage", sendMessage);
      console.log("send success");
    }
  }, [sendMessage]);

  useEffect(() => {
    socket?.on("receiveMessage", (data) => {
      console.log("receiveMessage", data);
      setReceivedMessage(data);
    });
  }, [socket]);

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
    return () => {};
  }, [userId, forceRerender]);

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== userId);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  const handleAddConversation = async (e) => {
    e.preventDefault();
    const data = { studentIdSubstring: studentId };
    let response = null;
    try {
      response = await Axios.post(`/conversations/checkid`, data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (error) {
      console.log(error)
    }
    if(response == null){
      setSearchId(true)
      return ;
    }
    setSearchId(false)
    setForceRerender(!forceRerender);
    setOpen(false);
    return response;
  };

  return (
    <Box
      bgcolor="white"
      flex={5}
      p={0}
      sx={{
        height: "80vh",
      }}>
      <Grid container>
        <Grid item xs={3}>
          <Box
            sx={{
              position: "relative",
              height: "100%",
              width: "100%",
              backgroundColor: "#F8FAFF",
              boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            }}>
            <Stack p={3} spacing={2} sx={{ height: "80%" }}>
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
                <Stack
                  direction={"row"}
                  alignItems="center"
                  sx={{ paddingLeft: 5 }}>
                  <Button variant="text" onClick={handleClickOpen}>
                    Add New Conversation
                  </Button>
                </Stack>
                <Divider />
              </Stack>
              <Stack
                spacing={1}
                sx={{ flexGrow: 1, overflowY: "scroll", height: "80%" }}>
                {chats?.map((chat) => {
                  return (
                    <div onClick={() => setCurrentChat(chat)}>
                      <ChatElement
                        data={chat}
                        currentUser={userId}
                        online={checkOnlineStatus(chat)}
                      />
                    </div>
                  );
                })}
              </Stack>
            </Stack>
          </Box>
        </Grid>
        <Grid item xs={9}>
          <Conversation
            chat={currentChat}
            currentUser={userId}
            setSendMessage={setSendMessage}
            receivedMessage={receivedMessage}
            key={receivedMessage}
          />
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} value={studentId}>
        <DialogTitle>Add new conversation</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Fill out Student Id"
            fullWidth
            onChange={(e) => setStudentId(e.target.value)}
            variant="standard"
          />
          {searchId && <Typography autoFocus
            required
            margin="dense"
            name="typo error"
            fullWidth
            variant="standard"
            sx ={{color: "red"}}
            >No user exist! </Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={handleAddConversation}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
export default Messenger;
