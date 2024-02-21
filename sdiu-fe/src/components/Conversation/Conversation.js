import {
  Box,
  Stack,
  Avatar,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import { useState, useEffect, useRef } from "react";
// import "./Conversation.scss";
import InputAdornment from "@mui/material/InputAdornment";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import Axios from "../../../src/configs/axiosConfig";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import InputEmoji from "react-input-emoji";

function Conversation({ chat, currentUser, setSendMessage, receivedMessage }) {
  const theme = useTheme();
  const [userData, setUserData] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scroll = useRef();
  const accessToken = localStorage.getItem("authToken");
  // console.log('render conversation')
  //fetch data for header
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    console.log(userId);
    const getUserData = async () => {
      try {
        const data = await Axios.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        // console.log(data.data);
        setUserData(data.data);
      } catch (e) {
        console.log(e);
      }
    };
    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await Axios.get(`/messages/${chat._id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setMessages(data.data);
        // console.log(data.data);
      } catch (e) {
        console.log(e);
      }
    };
    if (chat !== null) fetchMessages();
  }, [chat]);

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };
  const handleSend = async (e) => {
    e.preventDefault();
  
    if (!newMessage.trim()) {
      return;
    }
  
    const message = {
      senderId: currentUser,
      text: newMessage,
      conversationId: chat._id,
    };
  
    try {
      const response = await Axios.post("/messages", message);
      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  
    const receiverId = chat.members.find((id) => id !== currentUser);
    setSendMessage({ ...message, receiverId });
  };
  

  useEffect(() => {
    if (receivedMessage !== null && chat !== null && receivedMessage.conversationId === chat._id) {
      // console.log("Message Arrived: ", receivedMessage);
      // console.log("message", messages);
      setMessages([...messages, receivedMessage]);
    }
  }, [receivedMessage, chat]);
  

  //scroll to lastest message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {chat ? (
        <Stack height="99.5%">
          <Box
            p={2}
            sx={{
              height: 50,
              backgroundColor: "#F8FAFF",
              boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            }}>
            <Stack
              alignItems={"center"}
              direction={"row"}
              sx={{ width: "100%", height: "100%" }}
              justifyContent="space-between">
              <Stack spacing={2} direction="row">
                <Box>
                  <Avatar />
                </Box>
                <Stack spacing={0.2}>
                  <Typography variant="subtitle2">{userData?.name}</Typography>
                  <Typography variant="caption">
                    {userData?.studentId}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Box>
          <Box
            // m={1}
            width={"100%"}
            sx={{
              flexGrow: 1,
              overflowY: "scroll",
              width: "100%",
              height: "400px",
            }}>
            <Box m={1}>
              <Stack
                spacing={3}
                sx={{ flexGrow: 1, overflowY: "scroll", height: "100%" }}>
                {messages.map((message) => (
                  <>
                    <Stack
                      direction="row"
                      justifyContent={
                        message.senderId === currentUser ? "end" : "start"
                      }
                      ref={scroll}>
                      <Box
                        p={1.5}
                        sx={{
                          backgroundColor:
                            message.senderId === currentUser
                              ? "#0162C4"
                              : "rgb(180, 180, 180)",
                          borderRadius: 1.5,
                          width: "max-content",
                        }}>
                        <Typography
                          variant="body1"
                          color={
                            message.senderId === currentUser ? "#fff" : "black"
                          }>
                          {message.text}
                        </Typography>
                      </Box>
                    </Stack>
                  </>
                ))}
              </Stack>
            </Box>
          </Box>

          {/* footer*/}
          <Box
            p={1}
            sx={{
              //   height: 100,
              // width: 1000,
              backgroundColor: "#F8FAFF",
              boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            }}>
            <Stack direction="row" alignItems={"center"} spacing={3}>
              <InputEmoji
                value={newMessage}
                onChange={handleChange}
                placeholder="Type a message"
              />
              <Box
                sx={{
                  height: 48,
                  width: 48,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 1.5,
                }}
                onClick={handleSend}>
                <Stack
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%",
                  }}>
                  <IconButton>
                    <SendIcon />
                  </IconButton>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Stack>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "80vh",
          }}>
          <Typography variant="h6" gutterBottom>
            Tap on a chat to start conversation...
          </Typography>
        </Box>
      )}
    </>
  );
}

export default Conversation;
