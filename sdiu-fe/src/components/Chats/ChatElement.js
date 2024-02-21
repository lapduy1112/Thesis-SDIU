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
import Axios from "../../../src/configs/axiosConfig";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function ChatElement({ data, currentUser, online }) {
  const accessToken = localStorage.getItem("authToken");
  const [userData, setUserData] = useState(null);

  const userId = data.members.find((id) => id !== currentUser);
  useEffect(() => {
    async function getUserData() {
      await Axios.get(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          setUserData(res.data);
          console.log(res.data);
          return;
        })
        .catch((e) => {
          console.log(e.message);
        });
    }
    getUserData();
  }, []);

  return (
    <Box
      sx={{
        borderRadius: 1,
        backgroundColor: "#fff",
      }}
      p={2}>
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
        cursor="pointer">
        <Stack direction="row" spacing={2}>
          <Avatar />
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{userData?.name}</Typography>
            <Typography variant="caption">
              {online ? "Online" : "Offline"}
            </Typography>
          </Stack>
        </Stack>
        {/* <Stack spacing={2} alignItems={"center"}>
          <Typography sx={{ fontWeight: 600 }} variant="caption">
            11:11
          </Typography>
        </Stack> */}
      </Stack>
    </Box>
  );
}
export default ChatElement;
