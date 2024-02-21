import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import Box from "@mui/material/Box";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { Typography, InputAdornment } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Pagination from "@mui/material/Pagination";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import Axios from "../../../src/configs/axiosConfig";
import { ToastContainer, toast } from "react-toastify";

export default function NewsManage() {
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDesc, setEditedDesc] = useState("");
  const [editedPicture, setEditedPicture] = useState("");
  const [editedLink, setEditedLink] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");
  const [open, setOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState();
  const [selectedDeleteElement, setSelectedDeleteElement] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isDialogOpenDelete, setIsDialogOpenDelete] = useState(false);
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [index,setIndex] = useState(null)
  const [news, setNews] = useState([]);

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleCloseDelete = () => {
    setOpen(false);
  };
  const handleCloseDialogDelete = () => {
    setIsDialogOpenDelete(false);
  };
  const accessAdminToken = localStorage.getItem("authAdminToken");
  const decoded = jwtDecode(accessAdminToken);
  useEffect(() => {
    const func = async () => {
      const data = await Axios.get("/news", {
        headers: {
          Authorization: `Bearer ${accessAdminToken}`,
        },
      });
      setNews(data.data);
      console.log(data.data);
    };
    func();
    return;
  }, []);
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };
  const truncateDescription = (description) => {
    const maxLength = 15;
    return description.length > maxLength
      ? `${description.slice(0, maxLength)}...`
      : description;
  };
  const handleEdit = (news) => {
    setIndex(news._id)
    setEditedTitle(news.title);
    setEditedDesc(news.description);
    setEditedPicture(news.picture);
    setEditedLink(news.link);
    setSelectedElement(news);
    setIsDialogOpen(true);
  };

  const handleUpdate = async (newsId) => {
    if (!editedTitle || !editedDesc || !editedLink) {
      return toast.error("Invalid action");
    }
    const data = {
      title: editedTitle,
      description: editedDesc,
      link: editedLink,
    };
    try {
        const response = await Axios.patch(`/news/${newsId}`, data, {
      headers: { Authorization: `Bearer ${accessAdminToken}` },
    });
     const newss = await Axios.get("/news", {
       headers: {
         Authorization: `Bearer ${accessAdminToken}`,
       },
     });
     setNews(newss.data);
    
    setIndex(null)
    setEditedTitle("");
    setEditedDesc("");
    setEditedPicture("");
    setEditedLink("");
    setIsDialogOpen(false)
    setSelectedElement("")
   } catch(e){
        console.log(e)
    }
    ;
  };
  const handleDialogDelete = (newsId) => {
    setIndex(newsId);
    setSelectedDeleteElement(true);
    setIsDialogOpenDelete(true);
  };
  const handleDelete = async (newsId) => {
    try {
      const response = await Axios.delete(`/news/${newsId}`, {
        headers: { Authorization: `Bearer ${accessAdminToken}` },
      });
      setNews(news.filter((item) => item._id != newsId));
      console.log(response);
      setOpen(false);
      console.log(news.filter((item) => item._id !== newsId));
      handleCloseDelete()
      setIsDialogOpenDelete(false);
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };
  const filteredNews = news.filter((index) =>
    index.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <Box flex={6}>
      <Typography
        variant="h2"
        sx={{ marginBottom: "20px", color: "#2196f3", fontWeight: "bold" }}
      >
        News List
      </Typography>
      <Box sx={{ paddingBottom: "10px" }}>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      <TableContainer component={Paper} style={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Link</TableCell>
              <TableCell>Pictures</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredNews.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{truncateDescription(item.title)}</TableCell>
                <TableCell>{truncateDescription(item.description)}</TableCell>
                <TableCell>{item.dueDate}</TableCell>
                <TableCell>{truncateDescription(item.link)}</TableCell>
                <TableCell>{truncateDescription(item.pictures)}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDialogDelete(item._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {selectedElement && (
          <Dialog
            open={isDialogOpen}
            onClose={handleCloseDialog}
            selectedElement={selectedElement}
            maxWidth="md"
            fullWidth
            sx={{
              "& .MuiDialog-paper": { width: "80%", maxHeight: "80%" },
            }}
          >
            <DialogTitle>
              Edit News
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleCloseDialog}
                aria-label="close"
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Description"
                value={editedDesc}
                multiline
                rows={6}
                onChange={(e) => setEditedDesc(e.target.value)}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Link"
                value={editedLink}
                onChange={(e) => setEditedLink(e.target.value)}
                margin="dense"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="secondary">
                Cancel
              </Button>
              <Button onClick={() => handleUpdate(index)} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {selectedDeleteElement && (
          <Dialog
            open={isDialogOpenDelete}
            onClose={handleCloseDialogDelete}
            selectedElement={selectedElement}
            maxWidth="md"
            fullWidth
            sx={{
              "& .MuiDialog-paper": { width: "80%", maxHeight: "80%" },
            }}
          >
            <DialogTitle>
              Edit News
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleCloseDialogDelete}
                aria-label="close"
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Typography>Do you want to delete it?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialogDelete} color="secondary">
                Cancel
              </Button>
              <Button onClick={() => handleDelete(index)} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        )}
        <Pagination
          count={Math.ceil(news.length / itemsPerPage)}
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

      {/* <Dialog open={openDelete} onClose={handleCloseDelete} fullWidth>
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialogDelete}>No</Button>
          <Button
            // onClick={handleClose}
            autoFocus
            onClick={() => handleDelete(item._id)}>
            Yes
          </Button>
        </DialogActions>
      </Dialog> */}
    </Box>
  );
}