import { Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect } from "react";
import { Box, Stack, Container } from "@mui/material";
import Navigation from "../components/Navigation/Navigation";
import Sidebar from "../components/Sidebar/Sidebar";
import PrivateAdminRoutes from "../components/PrivateRoutes/PrivateAdminRoutes";
import StudentManage from "../components/StudentManage/StudentManage";
import NewsManage from "../components/NewsManage/NewsManage";
import PostManage from "../components/PostManage/PostManage";
import ReportManage from "../components/ReportManage/ReportManage";
import AddNews from "../components/AddNews/AddNews";
import Dashboard from "../components/Dashboard/Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { verifyAdminToken } from "../redux/features/auth/authSlice";
import NotFoundAdmin from "../components/NotFoundPage/NotFoundAdmin";

export default function AdminLayout() {
  const { isLoadingToken, isAdminLogin, isLoading } = useSelector(
    (state) => state.account
  );
  const token = localStorage.getItem("authAdminToken");
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchPrivateData = async () => {
      await dispatch(verifyAdminToken()).unwrap();
    };
    if (token) {
      fetchPrivateData();
    }
  }, []);
  return (
    <Box>
      <Stack direction="row" spacing={1} justifyContent="space-between">
        {!isAdminLogin && !localStorage.getItem("authAdminToken") ? (
          <Navigate replace to="/login" />
        ) : (
          <>
            <Sidebar />
            <Routes>
              <Route path="/" element={<PrivateAdminRoutes />}>
                <Route index element={<Dashboard />} />
                <Route path="/studentmanage" element={<StudentManage />} />
                <Route path="/newsmanage" element={<NewsManage />} />
                <Route path="/postmanage" element={<PostManage />} />
                <Route path="/reportmanage" element={<ReportManage />} />
                <Route path="/addnews" element={<AddNews />} />
                <Route path="*" element={<NotFoundAdmin />} />
              </Route>
            </Routes>
          </>
        )}
      </Stack>
    </Box>
  );
}
