import { Routes, Route, Navigate } from "react-router-dom";
import { Box, Stack, Container } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navigation from "../components/Navigation/Navigation";
import PrivateUserRoutes from "../components/PrivateRoutes/PrivateUserRoutes";
import Feed from "../components/Feed/Feed";
import MyPost from "../components/MyPost/MyPost";
import FoundList from "../components/FoundList/FoundList";
import LostList from "../components/LostList/LostList";
import AvailableList from "../components/AvailableList/AvailableList";
import CompleteList from "../components/CompleteList/CompleteList";
import Post from "../components/Post/Post";
import AddPost from "../components/AddPost/AddPost";
import AddReport from "../components/AddReport/AddReport";
import Messenger from "../components/Messenger/Messenger";
import NewsLists from "../components/NewsList/NewsList";
import NotFoundUser from "../components/NotFoundPage/NotFoundUser";
import News from "../components/News/News";
import Profile from "../components/Profile/Profile";
import { verifyToken } from "../redux/features/auth/authSlice";

export function UserLayout() {
  const { isLoadingToken, isLogin } = useSelector((state) => state.account);
  const token = localStorage.getItem("authToken");
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchPrivateData = async () => {
      await dispatch(verifyToken()).unwrap();
    };
    if (token) {
      fetchPrivateData();
    }
  }, []);
  return (
    <Box>
      <Navigation />
      <Stack direction="row" spacing={1} justifyContent="space-between">
        {!isLogin && !localStorage.getItem("authToken") ? (
          <Navigate replace to="/login" />
        ) : (
          <>
            <Routes>
              <Route path="/">
                <Route index element={<Feed />} />
                <Route path="/mypost" element={<MyPost />} />
                <Route path="/foundpost" element={<FoundList />} />
                <Route path="/lostpost" element={<LostList />} />
                <Route path="/availablepost" element={<AvailableList />} />
                <Route path="/completepost" element={<CompleteList />} />
                <Route path="/news" element={<NewsLists />} />
                <Route path="/post/:post_id" element={<Post />} />
                <Route path="/news/:news_id" element={<News />} />
                <Route path="/messenger" element={<Messenger />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/addpost" element={<AddPost />} />
                <Route path="/addreport" element={<AddReport />} />
                <Route path="*" element={<NotFoundUser />} />
              </Route>
            </Routes>
          </>
        )}
      </Stack>
    </Box>
  );
}
export default UserLayout;
