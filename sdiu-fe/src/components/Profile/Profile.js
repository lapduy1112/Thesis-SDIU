import {
  Box,
  Avatar,
  Stack,
  Grid,
  Typography,
  Container,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState, useEffect } from "react";
import Axios from "../../../src/configs/axiosConfig";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";

const ProfilePage = () => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openChangePasswordDialog, setOpenChangePasswordDialog] =
    useState(false);
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [data, setData] = useState(null);
  const { user_id } = useParams();
  const accessToken = localStorage.getItem("authToken");
  const decoded = jwtDecode(accessToken);
  useEffect(() => {
    async function getProfile() {
      await Axios.get(`/users/${decoded.payload.user._id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          setName(res.data.name);
          setStudentId(res.data.studentId);
          setEmail(res.data.email);
          setPhone(res.data.phone)
          console.log(res.data);
        })
        .catch((e) => {
          console.log(e.message);
        });
    }
    getProfile();
  }, []);
  const handleEditProfile = () => {
    setName(name);
    setStudentId(studentId);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleChangePassword = () => {
    setOpenChangePasswordDialog(true);
  };

  const handleCloseChangePasswordDialog = () => {
    setOpenChangePasswordDialog(false);
  };
  const handleSaveProfile = async () => {
    if (!name || !studentId) {
      return toast.error("Invalid action");
    }
    const data = { name, studentId };
    const response = await Axios.put("/users/updateprofile", data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log(response);
    toast.success("Change Profile Successful");
    setOpenEditDialog(false);
  };

  const handleSavePassword = async () => {
    if (
      !newPassword ||
      !confirm_password ||
      !currentPassword ||
      newPassword !== confirm_password ||
      newPassword === currentPassword
    ) {
      return toast.error("Invalid action");
    }
    const data = { currentPassword, newPassword };
    const response = await Axios.post(`/users/changepassword`, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log(response);
    setCurrentPassword("");
    setConfirmPassword("");
    setNewPassword("");
    setOpenChangePasswordDialog(false);
    return toast.success("Change successful");
  };

  return (
    <Container component="main" maxWidth="md" style={{ margin: "auto" }}>
      <Paper elevation={3} style={{ padding: 20, marginTop: 40 }}>
        <Typography variant="h5" align="center" gutterBottom>
          User Profile
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Name:</Typography>
            <Typography>{name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Email:</Typography>
            <Typography>{email}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Phone:</Typography>
            <Typography>{phone}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Student ID:</Typography>
            <Typography>{studentId}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditProfile}>
              Edit Profile
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleChangePassword}
              style={{ marginLeft: 16 }}>
              Change Password
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Edit Profile Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <TextField
            fullWidth
            label="Student ID"
            variant="outlined"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            style={{ marginBottom: 16 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveProfile} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog
        open={openChangePasswordDialog}
        onClose={handleCloseChangePasswordDialog}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          <TextField
            fullWidth
            type="password"
            label="Current Password"
            variant="outlined"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <TextField
            fullWidth
            type="password"
            label="New Password"
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            variant="outlined"
            value={confirm_password}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseChangePasswordDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSavePassword} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Container>
  );
};

export default ProfilePage;
