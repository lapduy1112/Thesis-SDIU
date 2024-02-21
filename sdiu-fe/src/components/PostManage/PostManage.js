import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import Box from "@mui/material/Box";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Pagination from "@mui/material/Pagination";
import Axios from "../../../src/configs/axiosConfig";
import { format } from "date-fns";
export default function PostManage() {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleView = (postId) => {
    const postToView = posts.find((post) => post._id === postId);
    setSelectedPost(postToView);
    console.log(postToView);
    setOpen(true);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const fetchPosts = async () => {
    try {
      const response = await Axios.get("/posts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authAdminToken")}`,
        },
      });
      console.log(response.data);
      setPosts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSort = (property) => {
    const sortedPosts = [...posts].sort((a, b) =>
      a[property].localeCompare(b[property])
    );
    setPosts(sortedPosts);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const truncateDescription = (description) => {
    const maxLength = 10;
    return description.length > maxLength
      ? `${description.slice(0, maxLength)}...`
      : description;
  };

  const filteredPost = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box flex={6}>
      <Typography
        variant="h2"
        sx={{ marginBottom: "20px", color: "#2196f3", fontWeight: "bold" }}>
        Post List
      </Typography>
      <TextField
        label="Search by Title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="dense"
      />
      <TableContainer component={Paper} style={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>
                <Button onClick={() => handleSort("title")}>Title</Button>
              </TableCell>
              <TableCell>Date</TableCell>
              <TableCell>
                <Button onClick={() => handleSort("category")}>Category</Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSort("status")}>Status</Button>
              </TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPost.map((item, index) => (
              <TableRow key={item._id}>
                <TableCell>
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell>{truncateDescription(item.owner.name)}</TableCell>
                <TableCell>{truncateDescription(item.title)}</TableCell>
                <TableCell>
                  {format(new Date(item.createdAt), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
                <TableCell>{truncateDescription(item.category)}</TableCell>
                <TableCell>{truncateDescription(item.status)}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleView(item._id)}>
                    View
                  </Button>
                  {/* <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(item._id)}>
                    Delete
                  </Button> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          count={Math.ceil(filteredPost.length / itemsPerPage)}
          page={currentPage}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "5px",
          }}
        />
      </TableContainer>
      {/* Modal (Dialog) */}
      {selectedPost && (
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              backgroundColor: "white",
              boxShadow: 24,
              p: 4,
              borderRadius: 8,
              outline: "none",
              "&:focus": {
                outline: "none",
              },
            }}>
            <Typography variant="h5" mb={2} fontWeight="bold" color="#2196f3">
              <strong>Title:</strong>
              {selectedPost.title}
            </Typography>
            <Typography variant="body1" color="#555">
              <strong>DueDate:</strong> {selectedPost.dueDate}
            </Typography>
            <Typography variant="body1" mb={2} color="#333">
              <strong>Description:</strong>
              {selectedPost.description}
            </Typography>
            <Typography variant="body2" color="#555">
              <strong>Category:</strong> {selectedPost.category}
            </Typography>
            <Typography variant="body2" color="#555">
              <strong>Status:</strong> {selectedPost.status}
            </Typography>
            {selectedPost.pictures && (
              <img
                src={selectedPost.pictures}
                alt={selectedPost.title}
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  marginBottom: "10px",
                  borderRadius: "4px",
                }}
              />
            )}
            <Box mt={2} textAlign="right">
              <Button variant="outlined" color="primary" onClick={handleClose}>
                Close
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
}
