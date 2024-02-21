import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Typography,
  CardHeader,
  CardMedia,
  Avatar,
  IconButton,
  TextField,
  Paper,
  Divider,
  Grid,
  Button,
  InputAdornment,
  Skeleton,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import Axios from "../../../src/configs/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import LinearProgress from "@mui/material/LinearProgress";
import SendIcon from "@mui/icons-material/Send";
import ClearIcon from "@mui/icons-material/Clear";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

function Post() {
  const [data, setData] = useState(null);
  const [seeMore, setSeeMore] = useState(false);
  const { post_id } = useParams();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [editedDesc, setEditedDesc] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDate, setEditedDate] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [openDialogRemove, setOpenDialogRemove] = useState(false);
  const [openDialogUpdate, setOpenDialogUpdate] = useState(false);
  const [openDialogStatus, setOpenDialogStatus] = useState(false);
  const accessToken = localStorage.getItem("authToken");
  const decoded = jwtDecode(accessToken);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPostById() {
      try {
        const response = await Axios.get(`/posts/${post_id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setData(response.data.post);
        setIsCompleted(response.data.post.status === "COMPLETE");
        setLoading(false);
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchPostById();
    return () => {};
  }, [post_id, accessToken]);

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await Axios.get(`/posts/comment/${post_id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setComments(response.data.data);
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchComments();
  }, [post_id, accessToken]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment) {
      toast.error("Missing values", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const data = {
      comment,
      userId: decoded.payload.user._id,
      postId: post_id,
    };

    try {
      const response = await Axios.post(`/posts/comment/${post_id}`, data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const responses = await Axios.get(`/posts/comment/${post_id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setComments(responses.data.data);
      setComment("");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await Axios.delete(`/posts/delete/${postId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      navigate("/user");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleUpdatePost = async (postId) => {
    try {
      const data1 = { description: editedDesc, title: editedTitle };
      const response = await Axios.put(`/posts/${postId}`, data1, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const response1 = await Axios.get(`/posts/${post_id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setData(response1.data.post);
      setOpenDialogUpdate(false);
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleRemoveComment = async (commentId) => {
    try {
      const response = await Axios.delete(`/posts/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const responses = await Axios.get(`/posts/comment/${post_id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setComments(responses.data.data);
      toast.success('Comment removed successfully!');
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleOpenDialogUpdate = () => {
    setOpenDialogUpdate(true);
  };
  const handleCloseDialogUpdate = () => {
    setOpenDialogUpdate(false);
  };
  const handleOpenDialogRemove = () => {
    setOpenDialogRemove(true);
  };
  const handleCloseDialogRemove = () => {
    setOpenDialogRemove(false);
  };

  const handleOpenDialogStatus = () => {
    setOpenDialogStatus(true);
  };
  const handleCloseDialogStatus = () => {
    setOpenDialogStatus(false);
  };

  const handleUpdateStatus = async (postId) => {
    try {
      const response = await Axios.patch(
        `/posts/updatestatus/${postId}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken} ` },
        }
      );
      if (response.data.post.status === "COMPLETE") {
        setIsCompleted(true);
        setOpenDialogStatus(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <Box
      bgcolor="lightgray"
      flex={6}
      p={{ xs: 0, md: 2 }}
      sx={{
        display: "flex",
        justifyContent: "center",
      }}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center">
        <Grid>
          {loading ? (
            <Skeleton
              variant="rectangular"
              width={600}
              height={400}
              sx={{ marginBottom: 2 }}
            />
          ) : (
            <Card
              sx={{
                width: 600,
                margin: "16px auto",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "gray" }} aria-label="recipe">
                    {data.owner.name.charAt(0).toUpperCase()}
                  </Avatar>
                }
                action={
                  data.owner._id === decoded.payload.user._id ? (
                    <>
                      <IconButton
                        aria-label="settings"
                        onClick={handleOpenDialogUpdate}>
                        <EditNoteIcon />
                      </IconButton>
                      <IconButton
                        aria-label="settings"
                        onClick={handleOpenDialogRemove}>
                        <ClearIcon />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton aria-label="settings">
                      <MapsUgcIcon />
                    </IconButton>
                  )
                }
                title={
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#333" }}>
                    {data.owner.name} - {data.owner.studentId}
                  </Typography>
                }
                subheader={
                  <Typography variant="subtitle2" sx={{ color: "#777" }}>
                    {data.dueDate} •
                    {formatDistanceToNow(new Date(data.createdAt), {
                      locale: enUS,
                    })}
                  </Typography>
                }
              />
              <CardContent sx={{ paddingTop: 0 }}>
                <Typography variant="body1" color="text.primary">
                  {data.description}
                </Typography>
              </CardContent>
              <CardMedia
                component="img"
                sx={{
                  width: "100%",
                  maxHeight: 400,
                  objectFit: "cover",
                }}
                image={data.pictures}
                alt="Post Image"
              />
              <CardActions disableSpacing>
                {data.owner._id === decoded.payload.user._id &&
                  (isCompleted ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ color: "green", fontWeight: "bold" }}>
                      Completed Post
                    </Typography>
                  ) : (
                    <IconButton
                      aria-label="update status"
                      onClick={handleOpenDialogStatus}>
                      <CheckCircleOutlineIcon style={{ color: "blue" }} />
                    </IconButton>
                  ))}
                {data.owner._id !== decoded.payload.user._id &&
                  (isCompleted ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ color: "green", fontWeight: "bold" }}>
                      Completed Post
                    </Typography>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ color: "red", fontStyle: "italic" }}>
                      Available Post
                    </Typography>
                  ))}
              </CardActions>
            </Card>
          )}
        </Grid>
        <Grid>
          <Box
            sx={{
              width: "600px",
              backgroundColor: "white",
              borderTop: "2px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}>
              <Avatar sx={{ bgcolor: "gray" }} aria-label="recipe" />
              <TextField
                id="outlined-basic"
                label="Comment"
                variant="outlined"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleCommentSubmit}>
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: "500px",
                  marginLeft: "10px",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              />
            </Box>
            {comments && comments.length > 0 && (
              <Paper
                key={new Date().getTime()}
                style={{ padding: "10px 20px" }}
                sx={{
                  width: "500px",
                  marginLeft: "10px",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column", // Thay đổi thành column
                    width: "100%",
                    alignItems: "end",
                    justifyContent: "end",
                    color: "blue",
                    pb: "20px",
                    pt: 0,
                  }}
                  onClick={() => setSeeMore(true)}>
                  {!seeMore && <Typography> See more</Typography>}
                </Box>
                {comments.map((index) => (
                  <Grid
                    container
                    spacing={2}
                    key={index.commentId}
                    sx={{ alignItems: "center", marginBottom: "10px" }} // Thêm margin để tách các comment
                  >
                    <Grid item>
                      <Avatar sx={{ bgcolor: "gray" }} aria-label="recipe">
                        {index.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </Grid>
                    <Grid item xs zeroMinWidth>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column", // Thay đổi thành column
                          marginLeft: "10px", // Thêm margin để tách avatar và nội dung
                        }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, color: "#333" }}>
                          {index.name}-{index.userId.studentId}
                        </Typography>
                        <Typography
                          variant="body1"
                          style={{ textAlign: "left", marginBottom: "5px" }}>
                          {index.comment}
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{
                            textAlign: "left",
                            color: "gray",
                            marginBottom: "5px", // Thêm margin để tách comment và thời gian
                          }}>
                          {formatDistanceToNow(new Date(index.updatedAt), {
                            locale: enUS,
                          })}
                        </Typography>
                      </Box>
                    </Grid>
                    {index.userId._id === decoded.payload.user._id && (
                      <IconButton
                        aria-label="remove comment"
                        onClick={() => handleRemoveComment(index._id)}
                        sx={{ marginLeft: "auto" }} // Thêm marginLeft để nút xóa nằm bên phải
                      >
                        <ClearIcon />
                      </IconButton>
                    )}
                  </Grid>
                ))}
              </Paper>
            )}
          </Box>
        </Grid>
      </Grid>

      <Dialog
        open={openDialogRemove}
        onClose={handleCloseDialogRemove}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this post?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialogRemove}>Cancel</Button>
          <Button onClick={() => handleDeletePost(post_id)} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialogStatus}
        onClose={handleCloseDialogStatus}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {"You have completed this object?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialogStatus}>Cancel</Button>
          <Button onClick={() => handleUpdateStatus(post_id)} autoFocus>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialogUpdate}
        onClose={handleCloseDialogUpdate}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Edit Post?"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={editedTitle}
            multiline
            onChange={(e) => setEditedTitle(e.target.value)}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Description"
            rows={6}
            value={editedDesc}
            multiline
            onChange={(e) => setEditedDesc(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogUpdate}>Cancel</Button>
          <Button onClick={() => handleUpdatePost(post_id)} autoFocus>
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Box>
  );
}
export default Post;
