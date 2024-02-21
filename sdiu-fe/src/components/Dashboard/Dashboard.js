import Header from "../Header/Header";
import { Box, Button, IconButton, Typography, Grid } from "@mui/material";
import CardSummary from "./component/CardSummary";
// import BarChart from "./component/BarChart";
import CardBar from "./component/CardBar";
import PieChartComponent from "./component/PieChart";
import { useEffect, useState } from "react";
import Axios from "../../../src/configs/axiosConfig";

export default function Dashboard() {
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPostsCompleted, setTotalPostsCompleted] = useState(0);
  const [totalPostsDay, setTotalPostsDay] = useState(0);
  const [totalPostsWeek, setTotalPostsWeek] = useState(0);
  const [totalFoundPost, setTotalFoundPost] = useState(0);
  const [totalLostPost, setTotalLostPost] = useState(0);
  const [totalStudent, setTotalStudent] = useState(0);
  const accessAdminToken = localStorage.getItem("authAdminToken");

  useEffect(() => {
    const func = async () => {
      const data = await Axios.get("/posts/numberpost", {
        headers: {
          Authorization: `Bearer ${accessAdminToken}`,
        },
      });
      setTotalPosts(data.data);
    };
    func();
    return;
  }, []);

  useEffect(() => {
    const func = async () => {
      const data = await Axios.get("/users/count", {
        headers: {
          Authorization: `Bearer ${accessAdminToken}`,
        },
      });
      setTotalStudent(data.data);
    };
    func();
    return;
  }, []);

  useEffect(() => {
    const func = async () => {
      const data = await Axios.get("/posts/completed/count", {
        headers: {
          Authorization: `Bearer ${accessAdminToken}`,
        },
      });
      setTotalPostsCompleted(data.data);
    };
    func();
    return;
  }, []);

  useEffect(() => {
    const func = async () => {
      const data = await Axios.get("/posts/found/count", {
        headers: {
          Authorization: `Bearer ${accessAdminToken}`,
        },
      });
      setTotalFoundPost(data.data);
    };
    func();
    return;
  }, []);

  useEffect(() => {
    const func = async () => {
      const data = await Axios.get("/posts/lost/count", {
        headers: {
          Authorization: `Bearer ${accessAdminToken}`,
        },
      });
      setTotalLostPost(data.data);
    };
    func();
    return;
  }, []);

  useEffect(() => {
    const func = async () => {
      const data = await Axios.get("/posts/day", {
        headers: {
          Authorization: `Bearer ${accessAdminToken}`,
        },
      });
      setTotalPostsDay(data.data);
    };
    func();
    return;
  }, []);

  useEffect(() => {
    const func = async () => {
      const data = await Axios.get("/posts/week", {
        headers: {
          Authorization: `Bearer ${accessAdminToken}`,
        },
      });
      setTotalPostsWeek(data.data);
    };
    func();
    return;
  }, []);

  return (
    <Box flex={6} padding={3}>
      <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      <Grid>
        <Grid container spacing={3}>
          <Grid item xl={3} lg={3} md={4} sm={6} xs={12}>
            <CardSummary
              title="Total posts"
              value={totalPosts}
              footer={<div> 24% increase from yesterday </div>}
            />
          </Grid>

          <Grid item xl={3} lg={3} md={4} sm={6} xs={12}>
            <CardSummary
              title="Total Posts today"
              value={totalPostsDay}
              footer={`${((totalPostsDay / totalPosts) * 100).toFixed(
                0
              )}% of the total number posts`}
            />
          </Grid>
          <Grid item xl={3} lg={3} md={4} sm={6} xs={12}>
            <CardSummary
              title="Total Posts in week"
              value={totalPostsWeek}
              footer={`${((totalPostsWeek / totalPosts) * 100).toFixed(
                0
              )}% of the total number posts`}
            />
          </Grid>
          <Grid item xl={3} lg={3} md={4} sm={6} xs={12}>
            <CardSummary
              title="Total Post completed"
              value={`${totalPostsCompleted}/${totalPosts}`}
              footer={`${((totalPostsCompleted / totalPosts) * 100).toFixed(
                0
              )}% of the total number posts`}
            />
          </Grid>
          <Grid item xl={3} lg={3} md={4} sm={6} xs={12}>
            <CardSummary
              title="Total Found Posts"
              value={`${totalFoundPost}`}
              footer={`${((totalFoundPost / totalPosts) * 100).toFixed(
                0
              )}% of the total number posts`}
            />
          </Grid>
          <Grid item xl={3} lg={3} md={4} sm={6} xs={12}>
            <CardSummary
              title="Total Lost Posts"
              value={`${totalLostPost}`}
              footer={`${((totalLostPost / totalPosts) * 100).toFixed(
                0
              )}% of the total number posts`}
            />
          </Grid>
          <Grid item xl={3} lg={3} md={4} sm={6} xs={12}>
            <CardSummary title="Number of students" value={`${totalStudent}`} />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
