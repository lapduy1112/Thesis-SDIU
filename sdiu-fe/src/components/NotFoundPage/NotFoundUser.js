// NotFound.js
import React from "react";
import { Typography, Container, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const NotFoundUser = () => {
  return (
    <Box bgcolor="white" flex={5} p={3}>
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "50px",
          justifyContent: "center",
        }}>
        <Typography variant="h2" color="error" sx={{ marginBottom: "20px" }}>
          404 - Not Found
        </Typography>
        <Typography
          variant="body1"
          sx={{ marginBottom: "30px", textAlign: "center" }}>
          Sorry, the page you are looking for does not exist.
        </Typography>
        <Button
          component={Link}
          to="/user"
          variant="contained"
          color="primary">
          Go to Home
        </Button>
      </Container>
    </Box>
  );
};

export default NotFoundUser;
