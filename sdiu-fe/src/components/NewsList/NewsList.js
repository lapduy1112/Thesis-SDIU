import {
  Box,
  Typography,
  Grid,
  Item,
  Paper,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Pagination,
} from "@mui/material";
import Axios from "../../../src/configs/axiosConfig";
import Skeleton from '@mui/material/Skeleton';
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function NewsLists() {
  const [news, setNews] = useState([]);
  const accessToken = localStorage.getItem("authToken");

  useEffect(() => {
    const func = async () => {
      const data = await Axios.get("/news", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setNews(data.data);
      console.log(data.data);
    };
    func();
    return;
  }, [accessToken]);
  const truncateDescription = (description) => {
    const maxLength = 50;

    if (description.length > maxLength) {
      return `${description.slice(0, maxLength)}...`;
    }

    return description;
  };
  return (
    <Box bgcolor="white" flex={5} p={3}>
      <Typography variant="h4" gutterBottom>
        News
      </Typography>
      <Box>
        <Grid container spacing={2}>
          {news &&
            news.map((index) => (
              <Grid item xs={4} key={index._id}>
                <Link
                  to={`/user/news/${index._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}>
                  <Card>
                    <CardMedia sx={{ height: 180 }} image={index.pictures} />
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {truncateDescription(index.title)}
                      </Typography>
                      <Typography variant="overline" color="text.secondary">
                        {index.dueDate}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {truncateDescription(index.description)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
}
export default NewsLists;
