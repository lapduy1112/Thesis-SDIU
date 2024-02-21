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
import Axios from "../../../src/configs/axiosConfig";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { jwtDecode } from "jwt-decode";
import IconButton from "@mui/material/IconButton";

export default function ReportManage() {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(null);
  const [selectedUpdateElement, setSelectedUpdateElement] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDialogOpenUpdate, setIsDialogOpenUpdate] = useState(false);
  const [selectedElement, setSelectedElement] = useState();

  const handleView = (reportId) => {
    const reportToView = reports.find((report) => report._id === reportId);
    setSelectedReport(reportToView);
    console.log(reportToView);
    setOpen(true);
  };
  const handleDialogUpdate = (reportId) => {
    setIndex(reportId);
    setSelectedUpdateElement(true);
    setIsDialogOpenUpdate(true);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleCloseUpdate = () => {
    setOpen(false);
  };
  const handleCloseDialogUpdate = () => {
    setIsDialogOpenUpdate(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const accessAdminToken = localStorage.getItem("authAdminToken");
  const decoded = jwtDecode(accessAdminToken);
  const handleUpdate = async (reportId) => {
    try {
      console.log(reportId);
      const response = await Axios.patch(
        `/report/${reportId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessAdminToken}`,
          },
        }
      );
      const response1 = await Axios.get("/report", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authAdminToken")}`,
        },
      });
      setReports(response1.data);
      setOpen(false);
      handleCloseUpdate();
      setIsDialogOpenUpdate(false);
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const fetchReports = async () => {
    try {
      const response = await Axios.get("/report", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authAdminToken")}`,
        },
      });
      console.log(response.data)
      setReports(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSort = (property) => {
    const sortedReports = [...reports].sort((a, b) =>
      a[property].localeCompare(b[property])
    );
    setReports(sortedReports);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const truncateDescription = (description) => {
    const maxLength = 10;
    return description.length > maxLength
      ? `${description.slice(0, maxLength)}...`
      : description;
  };

  return (
    <Box flex={6}>
      <Typography
        variant="h2"
        sx={{ marginBottom: "20px", color: "#2196f3", fontWeight: "bold" }}>
        Report List
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
              <TableCell>Email</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((item, index) => (
              <TableRow key={item._id}>
                <TableCell>
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell>{item.owner.name}</TableCell>
                <TableCell>{truncateDescription(item.owner.email)}</TableCell>
                <TableCell>{truncateDescription(item.content)}</TableCell>
                <TableCell>{truncateDescription(item.status)}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleView(item._id)}>
                    View
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDialogUpdate(item._id)}>
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Modal (Dialog) */}
      {selectedReport && (
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: 400, // Set a maximum width for responsiveness
              backgroundColor: "white",
              boxShadow: 24,
              p: 4,
              borderRadius: 8,
              outline: "none",
              "&:focus": {
                outline: "none",
              },
            }}>
            <Typography variant="h6" color="primary" mb={2}>
              Report Details
            </Typography>
            <Typography variant="body1" color="textPrimary" mb={1}>
              <strong>Owner:</strong> {selectedReport.owner.name}
            </Typography>
            <Typography variant="body1" color="textPrimary" mb={1}>
              <strong>Student ID:</strong> {selectedReport.owner.studentId}
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={1}>
              <strong>Content:</strong> {selectedReport.content}
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={1}>
              <strong>Status:</strong> {selectedReport.status}
            </Typography>
            <Box mt={3} textAlign="right">
              <Button variant="outlined" color="primary" onClick={handleClose}>
                Close
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
      {selectedUpdateElement && (
        <Dialog
          open={isDialogOpenUpdate}
          onClose={handleCloseDialogUpdate}
          selectedUpdateElement={selectedUpdateElement}
          maxWidth="md"
          fullWidth
          sx={{
            "& .MuiDialog-paper": { width: "80%", maxHeight: "80%" },
          }}>
          <DialogTitle>
            Edit News
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleCloseDialogUpdate}
              aria-label="close"
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography>Do you want to update it?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogUpdate} color="secondary">
              Cancel
            </Button>
            <Button onClick={() => handleUpdate(index)} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
