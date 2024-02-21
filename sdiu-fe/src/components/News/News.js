import { Box, Typography, Link } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from '@mui/material/LinearProgress';
import Axios from "../../configs/axiosConfig";

function News() {
  const navigate = useNavigate();
  const handleClick = (event) => {
    event.preventDefault();
    navigate("/user/news");
  };
  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      style={{ cursor: "pointer" }}
      onClick={handleClick}
      variant="h5">
      News
    </Link>,
    <Typography key="3" variant="h5" color="text.primary">
      General Information
    </Typography>,
  ];
  const { news_id } = useParams();
  const [data, setData] = useState(null);
  const accessToken = localStorage.getItem("authToken");
  useEffect(() => {
    async function fetchNewsById() {
      await Axios.get(`/news/${news_id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          setData(res.data);
          console.log(res.data);
        })
        .catch((e) => {
          console.log(e.message);
        });
    }
    fetchNewsById();
    return () => {};
  }, [news_id]);
  return (
    <Box flex={5} p={3}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        gutterBottom>
        {breadcrumbs}
      </Breadcrumbs>
      <br />
      {data ? (
        <div>
          <Typography variant="h4" gutterBottom>
            {data.title}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            {data.dueDate}
          </Typography>
          <Box>
            <img
              src={data.pictures}
              alt={data.title}
              style={{
                display: "block", // Make sure it's treated as a block-level element
                margin: "auto", // Center horizontally
                width: "1270px", // Limit the maximum width to 80% of the container
                height: "1018px", // Limit the maximum height to 80% of the viewport height
                height: "auto", // Maintain aspect ratio
              }}
              gutterBottom
            />
          </Box>
          <Typography variant="body1" paragraph>
            {/* {data.description} */}
            {data.description.split("\n").map((paragraph, paragraphIndex) => (
              <div key={paragraphIndex}>
                {paragraph.split("\n").map((line, lineIndex) => (
                  <p
                    key={lineIndex}
                    style={{
                      fontWeight:
                        lineIndex === 0 && paragraphIndex === 0
                          ? "bold"
                          : "normal",
                    }}>
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Source Link: <Link href={data.link}>{data.link}</Link>
          </Typography>
        </div>
      ) : (
        <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
      )}
    </Box>
  );
}
export default News;
