import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Link,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link as RouterLink } from "react-router-dom";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' or 'error'

  // Validation functions
  const isValidEmail = (email) => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidUsername = (username) => {
    // At least 3 characters, only alphanumeric
    const usernameRegex = /^[a-zA-Z0-9]{3,}$/;
    return usernameRegex.test(username);
  };

  const isValidPassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, and 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate email, username, and password
    if (!isValidEmail(email)) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Please enter a valid email address");
      setSnackbarOpen(true);
      return;
    }

    if (!isValidUsername(username)) {
      setSnackbarSeverity("error");
      setSnackbarMessage(
        "Username must be at least 3 characters long and contain only letters and numbers"
      );
      setSnackbarOpen(true);
      return;
    }

    if (!isValidPassword(password)) {
      setSnackbarSeverity("error");
      setSnackbarMessage(
        "Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one special character and one number"
      );
      setSnackbarOpen(true);
      return;
    }

    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Clear the fields after sign up
      setUsername("");
      setPassword("");
      setEmail("");

      // Open snackbar showing successful registration message
      setSnackbarSeverity("success");
      setSnackbarMessage("User registered successfully!");
      setSnackbarOpen(true);
    } else {
      // Open snackbar showing error message
      setSnackbarSeverity("error");
      setSnackbarMessage(data.message || "Registration failed");
      setSnackbarOpen(true);
    }
  };

  // Handle password visibility toggle
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Handle mouse down event (to prevent the focus loss on the icon)
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const handleSnackbarClose = () => {
    // Close the snackbar
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 6,
          p: 4,
          borderRadius: "10px",
          boxShadow: 3,
          backgroundColor: "black",
        }}
      >
        <Grid container spacing={2} maxWidth="400px">
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#00e676" }} // Green for a standout effect
            >
              Sign Up
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                input: { color: "white" }, // White text inside input
                label: { color: "white" }, // White label
                fieldset: { borderColor: "white" }, // White border
                "& .MuiOutlinedInput-root:hover fieldset": {
                  borderColor: "#00e676",
                }, // Green on hover
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                input: { color: "white" }, // White text inside input
                label: { color: "white" }, // White label
                fieldset: { borderColor: "white" }, // White border
                "& .MuiOutlinedInput-root:hover fieldset": {
                  borderColor: "#00e676",
                }, // Green on hover
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"} // Toggle between text and password
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ color: "white" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                input: { color: "white" }, // White text inside input
                label: { color: "white" }, // White label
                fieldset: { borderColor: "white" }, // White border
                "& .MuiOutlinedInput-root:hover fieldset": {
                  borderColor: "#00e676",
                }, // Green on hover
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSignUp}
              sx={{
                backgroundColor: "#089404",
                fontWeight: "bold",
                height: "50px",
                fontSize: "16px",
                "&:hover": { backgroundColor: "#008000" }, // Darker green on hover
              }}
            >
              Sign Up
            </Button>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography align="center" sx={{ mt: 1, color: "white" }}>
              Already have an account?{" "}
              <Link
                component={RouterLink}
                to="/login"
                variant="body1"
                underline="hover"
                style={{
                  color: "#00e676",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Log in
              </Link>
            </Typography>
          </Grid>

          {/* Snackbar for success or error messages */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Grid>
      </Box>
    </Container>
  );
};

export default SignUp;
