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
import { Typography, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Pagination from "@mui/material/Pagination";
import { getAllUsers } from "../../redux/features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Axios from "../../../src/configs/axiosConfig";

export default function StudentManage() {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(0);
  const [users, setUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const authAdminToken = localStorage.getItem("authAdminToken");
  useEffect(() => {
    const func = async () => {
      const data = await Axios.get("/users", {
        headers: {
          Authorization: `Bearer ${authAdminToken}`,
        },
      });
      setUser(data.data);
      console.log(data.data);
    };
    func();
    return;
  }, [authAdminToken]);
  const handleDelete = async (userId) => {
    try {
      const response = await Axios.delete(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${authAdminToken}` },
      });
      setUser(users.filter((item) => item._id != userId));
      console.log(response);
      setOpen(false);
      console.log(users.filter((item) => item._id !== userId));
      handleClose();
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box flex={6}>
      <Typography
        variant="h2"
        sx={{ marginBottom: "20px", color: "#2196f3", fontWeight: "bold" }}>
        Student List
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
              <TableCell>Name</TableCell>
              <TableCell>Student Id</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((item, index) => (
                <TableRow key={item._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.studentId}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleClickOpen}
                      onClick={() => handleDelete(item._id)}>
                      Delete
                    </Button>
                  </TableCell>
                  <Dialog open={open} onClose={handleClose} fullWidth>
                    <DialogTitle id="alert-dialog-title">
                      {"Are you sure?"}
                    </DialogTitle>
                    <DialogActions>
                      <Button onClick={handleClose}>No</Button>
                      <Button
                        // onClick={handleClose}
                        autoFocus
                        onClick={() => handleDelete(item._id)}>
                        Yes {item.name}
                      </Button>
                    </DialogActions>
                  </Dialog>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Pagination
          count={Math.ceil(users.length / itemsPerPage)}
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
    </Box>
  );
}
